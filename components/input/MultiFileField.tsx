import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

import  Text from "@/components/Text";
import  Previewable  from "@/components/Previewable";
import  Icon  from "@/components/Icon";
import { useGlobal } from "@/contexts/GlobalProvider";
import { MAX_IMAGES as LIMIT } from "@/database/schema";

interface ImageType {
    file: {
        uri: string;
        name: string | undefined;
        type: string;
    };
    image: string;
}

const MultiFileField = ({
    onChange,
    value
}: {
    onChange?: (value: any) => void;
    value?: any[];
}) => {
    const [selectedFiles, setSelectedFiles] = useState<ImageType[]>([]);
    const { setGlobalMessage } = useGlobal();
    const limit = Math.max(0, LIMIT - (value?.length || 0));

    const handleFileChange = async () => {
        if (!limit) {
            setGlobalMessage(
                `You have reached the limited count(${LIMIT}) of images!`
            );
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsMultipleSelection: true,
            base64: true,
            selectionLimit: limit
        });

        if (!result.canceled) {
            const mimeTypes = {
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                png: "image/png",
                gif: "image/gif",
                bmp: "image/bmp",
                webp: "image/webp"
            } as const;

            const imageFiles = result.assets.map(asset => {
                const extension =
                    (asset.uri
                        .split(".")
                        .pop()
                        ?.toLowerCase() as keyof typeof mimeTypes) || "jpg";

                return {
                    file: {
                        uri: asset.uri,
                        name: asset.uri.split("/").pop(),
                        type: mimeTypes[extension] ?? "image/jpeg"
                    },
                    image: asset.uri
                };
            });

            // Update state with the new files
            const updatedFiles = [...selectedFiles, ...imageFiles];
            setSelectedFiles(updatedFiles);

            if (onChange) {
                onChange(updatedFiles.map(item => item.file));
            }
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);

        if (onChange) {
            onChange(updatedFiles.map(item => item.file));
        }
    };

    return (
        <View
            className="w-full p-4 border-gray-400 rounded-xl"
            style={{
                borderWidth: selectedFiles.length > 0 ? 2 : 0
            }}
        >
            <View className="flex-row justify-evenly mb-4">
                <TouchableOpacity
                    onPress={handleFileChange}
                    className="flex items-center"
                    delayPressIn={0}
                >
                    <Text>New Image</Text>
                    <Icon name="image" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setSelectedFiles([]);
                        if (onChange) {
                            onChange([]);
                        }
                    }}
                    className="flex items-center"
                >
                    <Text>Clear Selected Images</Text>
                    <Icon name="image-not-supported" color="red" />
                </TouchableOpacity>
            </View>

            {selectedFiles.length > 0 && (
                <View className="border border-gray-100 mb-4" />
            )}

            <ScrollView className="max-h-64">
                <View className="flex-row justify-center flex-wrap gap-2">
                    {selectedFiles.map((item, index) => (
                        <View
                            key={index}
                            className="relative w-24 h-32 border border-gray-400 rounded-lg overflow-hidden"
                        >
                            <Previewable
                                source={{ uri: item.image }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                onPress={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-white p-1 rounded-full"
                            >
                                <Icon name="close" color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default MultiFileField;
