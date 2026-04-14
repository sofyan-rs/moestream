import { Alert } from 'heroui-native';
import React from 'react';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert status="danger" className="rounded-lg">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Error</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  )
}