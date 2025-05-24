import React, { useState } from "react";
import {
    Modal,
    View,
    Image,
    StyleSheet,
    ImageProps,
    TouchableOpacity
} from "react-native";

const ImagePreview = (props: ImageProps) => {
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const onClose = () => setShowPreview(false);

    if (!showPreview)
        return (
            <TouchableOpacity
                onPress={() => {
                    setShowPreview(true);
                }}
            >
                <Image {...props} />
            </TouchableOpacity>
        );

    return (
        <Modal
            visible={showPreview}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.imageContainer}>
                <Image className="" resizeMode="contain" {...props} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.8)"
    },
    image: {
        width: "100%",
        height: "100%"
    }
});

export default ImagePreview;
