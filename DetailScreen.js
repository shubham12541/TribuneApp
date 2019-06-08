import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, ScrollView, Share, AsyncStorage} from 'react-native';
import Moment from 'moment';
import HTML from 'react-native-render-html';
import { getParentsTagsRecursively } from 'react-native-render-html/src/HTMLUtils';
import Icon from './IconComponent';

import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default class DetailScreen extends React.Component{


    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: <Text style={{fontWeight: "bold", marginHorizontal: 4}}>{navigation.getParam("itemData", "").sectionTitle}</Text>,
            headerRight: (
                <View style={styles.headerButtons}>
                    <MaterialIcon 
                        name={navigation.getParam("isStorySaved") ? "bookmark" : "bookmark-border"} 
                        size={30}  
                        color="#5E98CA"
                        style={{marginRight: 20}}
                        onPress={navigation.getParam("toggleStory")} />
                    <Icon name="share" size={30} color="#5E98CA" style={{marginRight: 20}} onPress={navigation.getParam("shareStory")}></Icon>
                </View>
            )
        }
    }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.navigation.setParams({shareStory: this._shareStory.bind(this)});
        this.props.navigation.setParams({toggleStory: this._toggleStory.bind(this)});
        this.props.navigation.setParams({isStorySaved: false});


        this._isStorySaved(
            this.props.navigation.getParam("itemData").Articleid
        ).then(isSaved => {
            this.props.navigation.setParams({isStorySaved: isSaved});
        });
    }

    _isStorySaved = async (articleId) => {
        try{
            const savedlist = await AsyncStorage.getItem("@SavedList");
            if(savedlist){
                return JSON.parse(savedlist).findIndex(item => item.Articleid === articleId) !== -1;
            } else{
                return false;
            }
        } catch(err){
            console.log(err);
            return false;
        }
    }

    _toggleStory(){
        if(!this.props.navigation.getParam("isStorySaved", false)){
            this._saveStory();

            this.props.navigation.setParams({isStorySaved: true});
        } else{
            this._unsaveStory();
            this.props.navigation.setParams({isStorySaved: false});
        }
    }

    _saveStory = async() =>{
        try{
            const savedList = await AsyncStorage.getItem("@SavedList");
            let aSavedStories = [];
            let itemData = this.props.navigation.getParam("itemData", "");
            itemData['savedDate'] = Moment().format();

            if(savedList){
                aSavedStories = JSON.parse(savedList);
                aSavedStories.push(
                    itemData
                );
            } else{
                aSavedStories = [itemData];
            }

            AsyncStorage.setItem("@SavedList", JSON.stringify(aSavedStories));
            return true;
        } catch(err){
            console.log(err);
            return false;
        }
    }

    _unsaveStory = async() =>{
        try{
            const savedList = await AsyncStorage.getItem("@SavedList");

            if(savedList){
                let aSavedList = JSON.parse(savedList);
                const articleId = this.props.navigation.getParam("itemData").Articleid;

                aSavedList.splice(
                    aSavedList.findIndex(item => item.Articleid === articleId),
                    1
                );

                AsyncStorage.setItem("@SavedList", JSON.stringify(aSavedList));
                return true;
            } else{
                return false;
            }
        } catch(err){
            console.log(err);
            return false;
        }
    }

    _shareStory(){
        const itemData = this.props.navigation.getParam("itemData", {});

        Share.share({
            message: itemData.link,
            url: itemData.link,
            title: "Check this news story from Tribune"
        }, {
            dialogTitle: "Share news story"
        });

    }

    _isValidImageUrl(imageUrl){
        return imageUrl.toLowerCase().indexOf(".jpg") !== -1 
            || imageUrl.toLowerCase().indexOf(".png") !== -1 
            || imageUrl.toLowerCase().indexOf(".jpeg") !== -1;
    }

    _alterNode(node){
        const { name, parent } = node;
        
        // If the tag is an <a> and we've found a parent to be a blockquote
        // (see the utils part of this documentation to know more about getParentsTagsRecursively)
        if (name === 'iframe' ) {
            // console.log(node.attribs);
            // Let's assign a specific color to the node's attribs (if there already are)
            // node.attribs = { ...(node.attribs || {}), style: `width:40px;` };

            const screenWidth = Dimensions.get("window").width;
            const iframeWidth = Number.parseInt(node.attribs["width"], 10);
            const iframeHeight = Number.parseInt(node.attribs["height"]);
            const iframeRatio = iframeWidth/iframeHeight;

            node.attribs["width"] = screenWidth - 24;
            node.attribs["height"] = screenWidth/iframeRatio;
            return node;
        }
    }

    render(){
        const {navigation} = this.props;
        const itemData = navigation.getParam("itemData", {});
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
                    <HTML alterNode={this._alterNode} containerStyle={styles.htmlcontent} html={itemData.description} imagesMaxWidth={screenWidth}></HTML>

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
    },

    headerButtons: {
        flex: 1,
        flexDirection: 'row'
    }
});
