import React from "react";

import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypeBackground {
        appbar?: string;
    }

    interface Theme {
        palette: {
            background: TypeBackground;
        };
    }

    interface ThemeOptions {
        palette?: {
            background?: Partial<TypeBackground>;
        };
    }

    interface TypographyVariants {
        title: React.CSSProperties;
        link: React.CSSProperties;
        error: React.CSSProperties;
        discounted: React.CSSProperties;
    }

    // Allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        title?: React.CSSProperties;
        link?: React.CSSProperties;
        error?: React.CSSProperties;
        discounted?: React.CSSProperties;
    }
}

// Extend the Typography component's props
declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        title: true;
        link: true;
        error: true;
        discounted: true;
    }
}

export type IconType =
    | "material"
    | "materialCom"
    | "oct"
    | "ion"
    | "fa"
    | "fa5"
    | "fa6";

export type IconFamilyType =
    | "AntDesign"
    | "Entypo"
    | "EvilIcons"
    | "Feather"
    | "FontAwesome"
    | "FontAwesome5"
    | "FontAwesote6"
    | "Fontisto"
    | "Foundation"
    | "Ionicons"
    | "MaterialCommunityIcons"
    | "MaterialIcons"
    | "Octicons"
    | "SimpleLineIcons"
    | "Zocial";


export * from "./date";
export * from "./hero"
