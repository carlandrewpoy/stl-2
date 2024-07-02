function LogoTitle() {
    return (
        <Image
            style={{ width: 50, height: 50 }}
            source={require('@expo/snack-static/react-native-logo.png')}
        />
    );
}

function StackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
            />
        </Stack.Navigator>
    );
}