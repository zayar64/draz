import React, { useState, useEffect } from "react"
import { useLocalSearchParams } from "expo-router"

import { Container, View, Text } from "@/components"

export default function HeroDetail() {
  const { id } = useLocalSearchParams();
  
  return <Container>
  <Text>{id}</Text>
  </Container>
}
