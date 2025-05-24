import React from "react";

import View from "./View"
import Text from "./Text"

const Welcome = () => {
    return (
        <View style={{flex: 1,
        justifyContent: "center",
        alignItems: "center"}}>
            <Text>Welcome</Text>
        </View>
    );
};

export default Welcome;
