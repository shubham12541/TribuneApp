import React from 'react';
import {View, Text, StyleSheet, SectionList, Image, TouchableHighlight, Button, 
    AsyncStorage, ActivityIndicator, Platform, Alert} from 'react-native';
import Moment from 'moment';
import ExpandableList from 'react-native-expandable-section-list';
import TimeAgo from 'react-native-timeago';
import Icon from './IconComponent'

export default class HomeScreen extends React.Component{

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: <Text style={{fontWeight: "bold", marginHorizontal: 4}}>Home</Text>,
            headerRight: (
                <View style={styles.headerButtons}>
                     <Icon
                        style={styles.headerButtonsIcon}
                        name="refresh"
                        color="#5E98CA"
                        onPress={navigation.getParam("refresh")}
                        size={25} />
                    <Icon 
                        style={styles.headerButtonsIcon}
                        name="settings"
                        color="#5E98CA"
                        onPress={navigation.getParam("settings")}
                        size={25} />
                </View>
                // <Button title="Refresh" onPress={navigation.getParam("refresh")}></Button>
            )
        }
    }

    constructor(props){
        super(props);

        this.state = {
            config: [],
            isLoading: true,
            openedSectionIndex: 0
        };
    }

    componentDidMount(){
        this.props.navigation.setParams({refresh: this.fetchNewsData.bind(this)});
        this.props.navigation.setParams({settings: this._nagivateToSettingsPage.bind(this)});

        this.refreshView();
        
    }

    refreshView(){
        this._getSectionList().then(sections => {
            const defaultConfig =  [
                {id: 0, title: "Top Headlines", visible: true},
                {id: 7, title: "Nation" , visible: true},
                {id: 8, title: "World", visible: true},
                {id: 2, title: "Punjab", visible: true},
                {id: 3, title: "Haryana", visible: true},
                {id: 4, title: "Himachal", visible: true},
                {id: 5, title: "J&K", visible: true},
                {id: 16, title: "Delhi", visible: true},
                {id: 14, title: "Chandigarh", visible: true},
                {id: 9, title: "Sports", visible: true},
                {id: 10, title: "Business", visible: true},
                {id: 202, title: "In Focus", visible: true},
                {id: 38, title: "Movie Reviews", mid: 53, visible: true},
                {id: 34, title: "Editorials", mid: 70, visible: true},
                {id: 36, title: "This day, that year", mid: 70, visible: true},
                {id: 24, title: "Lifestyle", visible: true},
                {id: 18, title: "Tech", visible: true},
                {id: 32, title: "Job & Careers", visible: true},
                {id: 19, title: "Health", visible: true}
            ];


            if(!sections){
                this._storeSectionList(JSON.stringify(defaultConfig));
            } 


            this.setState({
                config: sections ? JSON.parse(sections) : defaultConfig,
                isLoading: true,
                openedSectionIndex: 0
            });

            this.fetchNewsData();
        }).catch(err => {
            console.log(err);
        });
    }

    fetchNewsData(){
        this.setState(prevState => {
            prevState.isLoading = true;
            return prevState;
        });

        this._loadSectionData("0")
            .then(_ => {
                this.setState(prevState => {
                    prevState.isLoading = false;

                    return prevState;
                });
            });

        return;

        // const BASE_URL = "https://www.tribuneindia.com/rss/feed.aspx?cat_id=";


        // const parseString = require('react-native-xml2js').parseString;

        // this.setState(prevState => {
        //     prevState.isLoading = true;
        //     return prevState;
        // });

        // Promise.all(this.state.config
        //                 .filter(oConfig => oConfig.visible)
        //                 .map((oConfig) => {
        //                     return fetch(BASE_URL + oConfig.id +  (oConfig.mid ? `&mid=${oConfig.mid}` : "")  )
        //                         .then(response => response.text());
        // })).then(aResponses => {
        //     let config = this.state.config;
        //     Promise.all(aResponses.map((response, index) => {
        //         return new Promise((resolve, reject) => {
        //             parseString(response, (err, result) => {
        //                 let items = result && result.rss && result.rss.channel ? result.rss.channel[0].item : [];
    
        //                 Promise.all(items.map(async (oItem) => {
        //                     return {
        //                         title: oItem.title ? oItem.title[0] : "",
        //                         pubDate: oItem.pubDate ?  oItem.pubDate[0] : "",
        //                         thumbimage: oItem.thumbimage ? oItem.thumbimage[0] : "",
        //                         updatedDate: oItem.updatedDate ? oItem.updatedDate[0] : "",
        //                         video_url:  oItem.video_url ? oItem.video_url[0] : "",
        //                         link: oItem.link?  oItem.link[0] : "",
        //                         fullimage: oItem.fullimage ? oItem.fullimage[0] : "",
        //                         excerpt: oItem.excerpt ? oItem.excerpt[0] : "",
        //                         description: oItem.description ? oItem.description[0] : "",
        //                         Articleid: oItem.Articleid ? oItem.Articleid[0] : "",
        //                         authorname: oItem.authorname ? oItem.authorname[0] : "",
        //                         authorimage: oItem.authorimage ? oItem.authorimage[0] : "",
        //                         mediacontent: {
        //                             height: oItem['media:content'][0].$.height,
        //                             width: oItem['media:content'][0].$.width,
        //                             url: oItem['media:content'][0].$.url
        //                         },
        //                         isStoryRead: oItem.Articleid ? await this._isStoryRead(oItem.Articleid) : false
        //                     };
    
        //                 })).then(aItems => {
        //                     config[index]['data'] = aItems;
        //                     resolve();
        //                 }).catch(err => {
        //                     console.log(err);
        //                     reject();
        //                 });
                        
        //             });
        //         });
                
        //     })).then(_ => {
        //         config = config.filter(oList => oList.data && oList.data.length > 0);

        //         this.setState({
        //             config: config,
        //             isLoading: false,
        //             openedSectionIndex: 0
        //         });

        //     }).catch(err => {
        //         console.log(err);
        //     });

        // }).catch(err => console.log(err));
    }

    _navigateToDetailPage(itemData, rowId, sectionId){
        const {navigation} = this.props;

        this.state.config[parseInt(sectionId, 10)].data[parseInt(rowId, 10)].isStoryRead = true;

        this._storeData(itemData.Articleid);

        navigation.navigate('Detail', {itemData: itemData, sectionName: this.state.config[parseInt(sectionId, 10)].title});
    }

    _nagivateToSettingsPage(){
        const {navigation} = this.props;
        navigation.navigate('Settings', {
            onGoBack: () => this.refreshView()
        });
    }

    _storeSectionList = async (aSectionList) => {
        try{
            await AsyncStorage.setItem("@SectionList", aSectionList);
        } catch(err){
            console.log(err);
        }
    }

    _getSectionList = async () =>{
        try{
            const sectionList = await AsyncStorage.getItem("@SectionList");
            if(sectionList){
                return sectionList;
            } else{
                return null;
            }
        } catch(err){
            console.log(err);
            return null;
        }
    }


    _storeData = async (title) => {
        try{
            await AsyncStorage.setItem("@PageRead:" + title, "yes");
        } catch(err){
            console.log(err);
        }
    }


    _isStoryRead = async (articleId) => {
        try{
            const value = await AsyncStorage.getItem("@PageRead:" + articleId);
            if(value) {
                return true;
            } else{
                return false;
            }
        } catch(err){
            console.log(err);
            return false;
        }
    }

    _loadSectionData = (sectionId) => {
        const parseString = require('react-native-xml2js').parseString;
        const BASE_URL = "https://www.tribuneindia.com/rss/feed.aspx?cat_id=";

        const oConfig = this.state.config[parseInt(sectionId, 10)];

        return fetch(BASE_URL + oConfig.id +  (oConfig.mid ? `&mid=${oConfig.mid}` : "")  )
            .then(response => response.text())
            .then(response => {
                return new Promise((resolve, reject) => {
                    parseString(response, (err, result) => {
                        if(err) reject(err);

                        resolve(
                            result && result.rss && result.rss.channel ? result.rss.channel[0].item : []
                        );
                    });
                });
            }).then(newsItems => {
                return Promise.all(newsItems.map(async (oItem) => {
                    return {
                        title: oItem.title ? oItem.title[0] : "",
                        pubDate: oItem.pubDate ?  oItem.pubDate[0] : "",
                        thumbimage: oItem.thumbimage ? oItem.thumbimage[0] : "",
                        updatedDate: oItem.updatedDate ? oItem.updatedDate[0] : "",
                        video_url:  oItem.video_url ? oItem.video_url[0] : "",
                        link: oItem.link?  oItem.link[0] : "",
                        fullimage: oItem.fullimage ? oItem.fullimage[0] : "",
                        excerpt: oItem.excerpt ? oItem.excerpt[0] : "",
                        description: oItem.description ? oItem.description[0] : "",
                        Articleid: oItem.Articleid ? oItem.Articleid[0] : "",
                        authorname: oItem.authorname ? oItem.authorname[0] : "",
                        authorimage: oItem.authorimage ? oItem.authorimage[0] : "",
                        mediacontent: {
                            height: oItem['media:content'][0].$.height,
                            width: oItem['media:content'][0].$.width,
                            url: oItem['media:content'][0].$.url
                        },
                        isStoryRead: oItem.Articleid ? await this._isStoryRead(oItem.Articleid) : false
                    };

                }))
            }).then(newsItems => {
                // oConfig['data'] = newsItems;
                debugger;
                this.setState(prevState => {
                    prevState.config[parseInt(sectionId)]['data'] = newsItems;
                    prevState.openedSectionIndex = parseInt(sectionId)
                    
                    return prevState;
                });
            }).catch(err => {
                console.log(err);
                
                Alert.alert(
                    "Error",
                    "This is embarassing, something went wrong",
                    [
                        {text: 'cancel', style: 'cancel'}
                    ]
                );
            });
    }

    _headerClick = (sectionId, isOpening) => {
        if(isOpening){
            this._loadSectionData(sectionId);
        }
    }

    render(){
        const {navigation} = this.props;

        if(this.state.isLoading){
            return(
                <View style={[styles.container, styles.centerItem]}>
                    <ActivityIndicator size="small" color="#5E98CA" />
                    <Text>Take a deep breath</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>

                <ExpandableList 
                    dataSource={this.state.config.filter(oConfig => oConfig.visible)}
                    headerKey="title"
                    memberKey="data"
                    renderRow={(item, rowId, sectionId) => {
                        if(!item){
                            return <NoItem />
                        }
                        return (
                            <TouchableHighlight underlayColor='gray' onPress={() => this._navigateToDetailPage(item, rowId, sectionId)}>
                                <SectionListItem itemData={item} />
                            </TouchableHighlight> 
                            )
                        }
                    }
                    headerOnPress={this._headerClick}
                    onRefreshStart={this.fetchNewsData.bind(this)}
                    renderSectionHeaderX={(section, sectionId) => <Text style={styles.sectionHeader}>{section}</Text> } 
                    openOptions={[this.state.openedSectionIndex]}
                 />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    headerButtons: {
        flex: 1,
        flexDirection: 'row'
    }, 

    headerButtonsIcon: {
        marginRight: 4,
        marginLeft: 12
    },

    centerItem: {
        alignItems: 'center',
        marginTop: 25
    },

    sectionHeader: {
        padding: 12,
        fontWeight: 'bold',
        fontSize: 14,
        color: "white",
        backgroundColor: 'rgba(94,152,202,1.0)',
    },
    sectionItem: {
        marginTop: 6,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    readStory: {
        fontWeight: "300",
        color: "#999999"
        // backgroundColor: "red"

    },

    unreadStory: {
        fontWeight: "500",
        // backgroundColor: "blue"
    },

    thumbimage: {
        height: 76,
        width: 114
    },

    sectionTitleText: {
        paddingLeft: 4,
        fontSize: 15
    },

    sectionPublishedDate: {
        fontSize: 12,
        fontWeight: '300',
        marginTop: 4,
        paddingLeft: 4
    }
});

class SectionListItem extends React.Component{

    constructor(props){
        super(props);
        // console.log(this.props.itemData)
    }

    render(){
        Moment.locale('en');
        const defaultThumb = "https://lh3.googleusercontent.com/7CYIDjpL7SwqwSHARJ8SAEeNfGk7ZiEwNzWP01mfPxvV98Ku6i3wPHqADSrFDQDV5nCOA8Tv5QU=-p";

        return(
            <View style={styles.sectionItem}>
                <Image source={{uri: this.props.itemData.thumbimage ? this.props.itemData.thumbimage : defaultThumb }} 
                    style={styles.thumbimage} />

                <View style={{flex: 1}}>
                    <Text style={[styles.sectionTitleText, this.props.itemData.isStoryRead ? styles.readStory : styles.unreadStory]} numberOfLines={4}>{this.props.itemData.title}</Text>
                    <TimeAgo style={styles.sectionPublishedDate} time={this.props.itemData.updatedDate} ></TimeAgo>
                </View>
            </View>
        )
    }

}

class NoItem extends React.Component{

    constructor(){}

    render(){
        return (
            <Text text="No data found" />
        )
    }
}

