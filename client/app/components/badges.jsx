import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Badges = ({ type }) => {

    console.log(type);
    const types = {
        senior: {
            text: 'Senior',
            color: '#FD9E02',
        },
        junior: {
            text: 'Junior',
            color: '#FD9E02',
        },
        juvenile: {
            text: 'Juvenil',
            color: '#FD9E02',
        },
        cadet: {
            text: 'Cadete',
            color: '#FD9E02',
        },
        male: {
            text: 'Male',
            color: '#539DF3',
        },
        female: {
            text: 'Female',
            color: '#FF0AD8',
        },
        mixed: {
            text: 'Mixed',
            color: '#9953F3',
        },
        won: {
            text: 'Won',
            color: '#FFD60A',
        },
        lost: {
            text: 'Lost',
            color: '#FF2C2C',
        },
        pending: {
            text: 'Pending',
            color: '#3AFF4E',
        },
        captain: {
            text: 'Captain',
            color: '#FFD60A',
        },
        all: {
            text: 'All',
            color: '#FFD60A',
        },
        defense: {
            text: 'Defense',
            color: '#9953F3',
        },
        receive: {
            text: 'Receive',
            color: '#539DF3',
        },
    }

    const hexToRgb = (hex) => {
        hex = hex.replace('#', '');
    
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
    
        return { r, g, b };
    };

    const reduceOpacity = (rgbColor, opacity) => {
        opacity = Math.max(0, Math.min(1, opacity));
        return `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
    };

    const styles = StyleSheet.create({
        container: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        badge: {
            backgroundColor: reduceOpacity(hexToRgb(types[type].color), 0.1),
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginRight: 10,
        },
        badgeText: {
          color: types[type].color,
          fontSize: 14,
        },
    });
      
    return (
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{types[type].text}</Text>
        </View>
    );
};

export default Badges;