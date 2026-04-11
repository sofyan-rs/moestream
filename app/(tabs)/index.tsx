import { Button } from 'heroui-native'
import React from 'react'
import { ScrollView } from 'react-native'

export default function HomeScreen() {
    return (
        <ScrollView className="h-full">
            <Button onPress={() => console.log('Pressed!')}>TEST BUTTON</Button>
        </ScrollView>
    )
}