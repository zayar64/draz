import React, { useRef, useState } from "react";
import { View } from "react-native";
import Button from "./Button";
import Text from "./Text";

interface FormProps {
    onSubmit: (values: Record<string, string | boolean>) => void;
    children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
    const formValues = useRef<Record<string, string | boolean>>({});
    const [submitCount, setSubmitCount] = useState<number>(0);

    const handleInputChange = (name: string, value: string | boolean) => {
        formValues.current[name] = value;
    };

    const handleSubmit = () => {
        const values = formValues.current;
        setSubmitCount(prev => prev + 1);

        // Check for required fields
        const hasEmptyFields = Object.values(values).some(
            value => value === ""
        );

        if (hasEmptyFields) return;
        onSubmit(values);
    };
    const processChildren = (child: React.ReactNode): React.ReactNode =>
        React.Children.map(child, c => {
            if (
                !React.isValidElement<{
                    name?: string;
                    value?: string;
                    required?: boolean;
                    children?: React.ReactNode;
                    onChange?: (value: any) => void;
                    onChangeText?: (value: string) => string;
                }>(c)
            )
                return c;

            if (c.props.name) {
                if (!formValues.current[c.props.name]) {
                    handleInputChange(c.props.name, c.props.value || "");
                }

                return (
                    <View className="mb-4">
                        {React.cloneElement(c, {
                            onChangeText: (text: string) => {
                                handleInputChange(c.props.name || "", text);
                                c.props.onChangeText?.(text);
                            },
                            onChange: (value: string | boolean) => {
                                handleInputChange(c.props.name || "", value);
                                c.props.onChange?.(value);
                            }
                        } as Partial<typeof c.props>)}
                        {c.props.required &&
                            formValues.current[c.props.name] === "" && (
                                <Text style={{ color: "#f00" }}>
                                    This field is required
                                </Text>
                            )}
                    </View>
                );
            }

            if (c.props.children) {
                return React.cloneElement(c, {
                    children: processChildren(
                        c.props.children
                    ) as React.ReactNode
                } as Partial<typeof c.props>);
            }

            return c;
        });

    return (
        <View>
            {processChildren(children)}
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default Form;
