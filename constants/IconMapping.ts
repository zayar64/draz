import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
//import FontAwesome5Brands from "@expo/vector-icons/FontAwesome5Brands";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
//import FontAwesome6Brands from "@expo/vector-icons/FontAwesome6Brands";
import Fontisto from "@expo/vector-icons/Fontisto";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Zocial from "@expo/vector-icons/Zocial";

import AntDesignNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/AntDesign.json";
import EntypoNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Entypo.json";
import EvilIconsNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/EvilIcons.json";
import FeatherNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Feather.json";
import FontAwesomeNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome.json";

import FontAwesome5Names1 from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome5Free.json";
import FontAwesome5Names2 from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome5Free_meta.json";
import FontAwesome6Names1 from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome6Free.json";
import FontAwesome6Names2 from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome6Free_meta.json";

import FontistoNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Fontisto.json";
import FoundationNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Foundation.json";
import IoniconsNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json";
import MaterialCommunityIconsNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json";
import MaterialIconsNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json";
import OcticonsNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Octicons.json";
import SimpleLineIconsNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/SimpleLineIcons.json";
import ZocialNames from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Zocial.json";

const iconFamilies = [
    "AntDesign",
    "Entypo",
    "EvilIcons",
    "Feather",
    "FontAwesome",
    "FontAwesome5",
    //"FontAwesome5Brands",
    "FontAwesote6",
    //"FontAwesome6Brands",
    "Fontisto",
    "Foundation",
    "Ionicons",
    "MaterialCommunityIcons",
    "MaterialIcons",
    "Octicons",
    "SimpleLineIcons",
    "Zocial"
];

export const iconFamilyNamesMapping = {
    AntDesign: Object.keys(AntDesignNames),
    Entypo: Object.keys(EntypoNames),
    EvilIcons: Object.keys(EvilIconsNames),
    Feather: Object.keys(FeatherNames),
    FontAwesome: Object.keys(FontAwesomeNames),
    FontAwesome5: [
        ...Object.keys(FontAwesome5Names1),
        ...Object.keys(FontAwesome5Names2)
    ],
    FontAwesome6: [
        ...Object.keys(FontAwesome6Names1),
        ...Object.keys(FontAwesome6Names2)
    ],
    Fontisto: Object.keys(FontistoNames),
    Foundation: Object.keys(FoundationNames),
    Ionicons: Object.keys(IoniconsNames),
    MaterialCommunityIcons: Object.keys(MaterialCommunityIconsNames),
    MaterialIcons: Object.keys(MaterialIconsNames),
    Octicons: Object.keys(OcticonsNames),
    SimpleLineIcons: Object.keys(SimpleLineIconsNames),
    Zocial: Object.keys(ZocialNames)
};

export const iconFamilyMapping: any = {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial
};

export const iconShortFamilyMapping: any = {
    ant: AntDesign,
    ent: Entypo,
    evil: EvilIcons,
    feather: Feather,
    fa: FontAwesome,
    fa5: FontAwesome5,
    //fa5b: FontAwesome5Brands,
    fa6: FontAwesome6,
    //fa6b: FontAwesome6Brands,
    fontisto: Fontisto,
    foundation: Foundation,
    ion: Ionicons,
    materialCom: MaterialCommunityIcons,
    material: MaterialIcons,
    oct: Octicons,
    simpleLine: SimpleLineIcons,
    zocial: Zocial
};
