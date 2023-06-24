import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, Button, TextInput } from 'react-native-paper';
import { registerStyle } from './regicter.style';
import { theme } from '../../../App.style';
import { HeaderComponent } from '../../components/header/header.component';

export const RegisterScreen = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <HeaderComponent title='Регистрация' />
                <View style={registerStyle.content}>
                    <TextInput label="Имя" />
                    <TextInput label="Фамилия" />
                    <TextInput label="Отчество" />
                    <TextInput label="Телефон" keyboardType='phone-pad' />
                    <TextInput label="Email" keyboardType='email-address' />
                    <TextInput label="Пароль" secureTextEntry={true} right={<TextInput.Icon icon="eye-off-outline" color={registerStyle.icon.color} />} />
                    <TextInput label="Подтверждение пароля" secureTextEntry={true} right={<TextInput.Icon icon="eye-off-outline" color={registerStyle.icon.color} />} />
                    <Button mode='contained' style={theme.cardButton}>Зарегистрироваться</Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}