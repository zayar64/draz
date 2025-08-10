import { Alert } from "react-native";

const Confirm = (
    title: string,
    message: string,
    onConfirm: () => void
): void => {
    Alert.alert(
        title,
        message,
        [
            {
                text: "Cancel",
                onPress: () => {},
            },
            {text: ""},
            {
                text: "OK",
                onPress: () => {
                    onConfirm();
                }
            }
        ],
        { cancelable: true }
    );
};

export default Confirm;
