import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, ScrollView} from 'react-native';
import Moment from 'moment';
import HTML from 'react-native-render-html';

export default class DetailScreen extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
    }

    _isValidImageUrl(imageUrl){
        return imageUrl.toLowerCase().indexOf(".jpg") !== -1 
            || imageUrl.toLowerCase().indexOf(".png") !== -1 
            || imageUrl.toLowerCase().indexOf(".jpeg") !== -1;
    }
    
    render(){
        const {navigation} = this.props;
        const itemData = navigation.getParam("itemData", {});
        console.log(itemData);
        const imageRatio = Number.parseInt(itemData.mediacontent.width, 10)/Number.parseInt(itemData.mediacontent.height, 10);

        const screenWidth = Dimensions.get("window").width;
        const adjustedHeight = screenWidth/imageRatio;

        Moment.locale('en');
        const defaultImageUrl = "https://lh3.googleusercontent.com/7CYIDjpL7SwqwSHARJ8SAEeNfGk7ZiEwNzWP01mfPxvV98Ku6i3wPHqADSrFDQDV5nCOA8Tv5QU=-p";
        
        return(
            <ScrollView>
                <View style={styles.container}>
                    <Image source={{uri: this._isValidImageUrl(itemData.fullimage) ? itemData.fullimage : defaultImageUrl }} 
                        style={{height: adjustedHeight, width: screenWidth}} />

                    <Text style={styles.articleTitle} >{itemData.title}</Text>
                    <Text style={styles.sectionPublishedDate}>{Moment(itemData.pubDate).format('LLLL')}</Text>
                    {
                        itemData.authorname ? <Text style={styles.sectionPublishedDate}>{itemData.authorname}</Text> : null
                    }
                    <HTML containerStyle={styles.htmlcontent} html={itemData.description} imagesMaxWidth={Dimensions.get('window').width}></HTML>

                    <Text style={[styles.sectionPublishedDate, styles.bottomMargin]}>Last Updated: { Moment(itemData.updatedDate).format('LLLL')}</Text>
                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    articleTitle: {
        fontSize: 24,
        marginTop: 12,
        padding: 4,
        fontWeight: '500'
    },

    sectionPublishedDate: {
        fontSize: 12,
        fontWeight: '300',
        marginTop: 4,
        paddingLeft: 4
    },

    htmlcontent: {
        padding: 12
    },

    bottomMargin: {
        marginBottom: 12
    }
});
