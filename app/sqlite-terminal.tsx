import React, { useState, useEffect, useMemo, useRef } from "react";
import {
    ScrollView,
    View,
    FlatList,
    Switch,
    TouchableOpacity,
    TextInput
} from "react-native";
import { default as kvstore } from "expo-sqlite/kv-store";

import { db } from "@/database";
import { Container, Text, TextField, Icon, Button } from "@/components";
import { useGlobal, useTheme } from "@/contexts";

// Define the result type
type SQLiteResult = Record<string, any>; // Represents a row with dynamic keys

const SQLiteConsole = () => {
    const [executedStatememts, setExecutedStatements] = useState<string[]>([
        ""
    ]);
    const [executionIndex, setExecutionIndex] = useState<number>(1);
    const [statement, setStatement] = useState<string>(
        executedStatememts[executionIndex] || ""
    );
    const inputRef = useRef<TextInput>(null);

    const [result, setResult] = useState<SQLiteResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [multiline, setMultiline] = useState<boolean>(false);

    const { setLoading } = useGlobal();
    const { colors } = useTheme();

    // Query types definition
    const queryTypes: { read: string[]; write: string[] } = {
        read: ["select", "pragma", "explain", "show", "with"],
        write: [
            "create",
            "insert",
            "alter",
            "update",
            "delete",
            "replace",
            "drop"
        ]
    };

    const isReadQuery = (query: string): boolean =>
        queryTypes.read.some(type => query.toLowerCase().startsWith(type));

    const columnWidths = useMemo(() => {
        const widths: Record<string, number> = {};
        for (const pair of result) {
            const keys = Object.keys(pair);
            const values = Object.values(pair);
            values.forEach((value, index) => {
                widths[keys[index]] = Math.min(
                    20,
                    Math.max(String(value).length, widths[keys[index]] || 0, 6)
                );
            });
        }
        return widths;
    }, [result]);

    const handleExecute = async () => {
        const query = statement.trim();
        if (!query) return;
        
        if (query === "delete permission") {
          await kvstore.setItem("consolePermissionGranted", "0")
        }
        
        

        setError(null);
        setResult([]);
        setExecutedStatements(prev => (prev[0] ? [...prev, query] : [query]));
        setStatement("");
        const isRead = isReadQuery(query);

        try {
            let response;
            if (isRead) {
                response = await db.getAllAsync<SQLiteResult>(query);
            } else {
                await db.runAsync("BEGIN TRANSACTION");
                for (const cmd of query.split(";")) {
                    if (!cmd) continue;
                    response = await db.runAsync(cmd);
                }
                await db.runAsync("COMMIT");
            }

            if (
                !isRead &&
                typeof response === "object" &&
                "changes" in response
            ) {
                response = [
                    {
                        lastinsertrowid: response.lastInsertRowId ?? null,
                        changes: response.changes ?? 0
                    }
                ];
            } else {
                response = response as SQLiteResult[];
            }
            setResult(response);
        } catch (e) {
            if (!isRead) {
                await db.runAsync("ROLLBACK");
            }
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            inputRef.current?.blur();
        }
    };

    useEffect(() => {
        setExecutionIndex(executedStatememts.length);
    }, [executedStatememts]);

    useEffect(() => {
        inputRef.current?.focus();
        setStatement(executedStatememts[executionIndex] || "");
    }, [executionIndex]);

    const memoizedResult = useMemo(() => {
        return (
            <>
                {result.length > 0 && (
                    <ScrollView horizontal className="mt-4">
                        <View className="flex-1">
                            {/* Hostories */}
                            {/*<FlatList
                            data={executedStatememts}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <Text>
                                    {index}. {item}
                                </Text>
                            )}
                            nestedScrollEnabled
                        />*/}

                            {/* Sticky Header */}
                            {Object.keys(result[0]).length > 0 && (
                                <View
                                    className="flex-row border-b"
                                    style={{
                                        backgroundColor: colors.primary,
                                        borderColor: colors.text
                                    }}
                                >
                                    {Object.keys(result[0]).map(key => (
                                        <Text
                                            key={key}
                                            className="p-1 border text-center"
                                            style={{
                                                width: columnWidths[key] * 10,
                                                borderColor: colors.text
                                            }}
                                        >
                                            {key.toUpperCase()}
                                        </Text>
                                    ))}
                                </View>
                            )}

                            {/* Scrollable Table Rows */}
                            <FlatList
                                data={result}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View className="flex-row">
                                        {Object.entries(item).map(
                                            ([key, val], i) => (
                                                <Text
                                                    key={`${key}-${i}`} // Ensures unique key
                                                    className="p-1 border text-center"
                                                    style={{
                                                        width:
                                                            columnWidths[key] *
                                                            10,
                                                        borderColor: colors.text
                                                    }}
                                                >
                                                    {String(val)}
                                                </Text>
                                            )
                                        )}
                                    </View>
                                )}
                                nestedScrollEnabled
                            />
                        </View>
                    </ScrollView>
                )}
            </>
        );
    }, [result]);

    return (
        <Container className="flex-1">
            {/* Multiline Toggle */}
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                    <Text>SQLite Console ( Multiline</Text>
                    <View style={{ transform: [{ scale: 0.8 }] }}>
                        <Switch
                            value={multiline}
                            onValueChange={setMultiline}
                            thumbColor={multiline ? "lightgreen" : "gray"}
                        />
                    </View>
                    <Text>)</Text>
                </View>

                <View className="flex-row space-x-4">
                    <TouchableOpacity
                        onPress={() =>
                            setExecutionIndex(prev => Math.max(0, prev - 1))
                        }
                    >
                        <Icon name="arrow-circle-up" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            setExecutionIndex(prev =>
                                Math.min(executedStatememts.length, prev + 1)
                            )
                        }
                    >
                        <Icon name="arrow-circle-down" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* SQL Input */}
            <TextField
                multiline={multiline}
                onChangeText={setStatement}
                onEndEditing={handleExecute}
                value={statement}
                ref={inputRef}
                numberOfLines={10}
            />

            {multiline && (
                <View className="mt-4">
                    <Button title="Execute" onPress={handleExecute} />
                </View>
            )}

            {error && <Text className="text-red-500 mt-2">{error}</Text>}

            {memoizedResult}
        </Container>
    );
};

export default SQLiteConsole;
