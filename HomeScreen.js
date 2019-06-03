import React from 'react';
import {View, Text, StyleSheet, SectionList, Image, TouchableHighlight, Button} from 'react-native';
import Moment from 'moment';
import ExpandableList from 'react-native-expandable-section-list';
import TimeAgo from 'react-native-timeago';

export default class HomeScreen extends React.Component{

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: <Text style={{fontSize: 20, fontWeight: "bold"}}>Home</Text>,
            headerRight: (
                <Button style={{fontSize: 2}} title="Refresh" onPress={navigation.getParam("refresh")}></Button>
            )
        }
    }

    constructor(props){
        super(props);

        this.state = {
            config: [
                {id: 0, title: "Top Headlines"},
                {id: 7, title: "Nation"},
                {id: 8, title: "World"},
                {id: 2, title: "Punjab"},
                {id: 4, title: "Himachal"},
                {id: 16, title: "Delhi"},
                {id: 5, title: "J&K"},
                {id: 12, title: "Opinion"},
                {id: 10, title: "Business"},
                {id: 202, title: "In Focus"},
                {id: 53, title: "Movie Review"},
                {id: 203, title: "Weekly Pullouts"},
                {id: 18, title: "Sci/Tech/Gadgets"},
                {id: 19, title: "Health"}
            ],
            isLoading: true
        };
    }

    componentDidMount(){
        this.props.navigation.setParams({refresh: this.fetchNewsData.bind(this)})
        this.fetchNewsData();
    }

    fetchNewsData(){
        const BASE_URL = "https://www.tribuneindia.com/rss/feed.aspx?cat_id=";

        const parseString = require('react-native-xml2js').parseString;

        this.setState(prevState => {
            prevState.isLoading = true;
            return prevState;
        });

        Promise.all(this.state.config.map((oConfig) => {
            return fetch(BASE_URL + oConfig.id)
                .then(response => response.text());
        })).then(aResponses => {
            let config = this.state.config;
            aResponses.map((response, index) => {
                parseString(response, (err, result) => {
                    let items = result && result.rss && result.rss.channel ? result.rss.channel[0].item : [];

                    items = items.map((oItem) => {
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
                            }
                        }
                    });

                    config[index]['data'] = items;
                });
            });

            this.setState({
                config: config,
                isLoading: false
            });
        }).catch(err => console.log(err));
    }

    _navigateToDetailPage(itemData){
        const {navigation} = this.props;

        navigation.navigate('Detail', {itemData: itemData});
    }

    render(){
        const {navigation} = this.props;

        if(this.state.isLoading){
            return(
                <View style={[styles.container, styles.centerItem]}>
                    <Text>Take a deep breath</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>

                <ExpandableList 
                    dataSource={this.state.config}
                    headerKey="title"
                    memberKey="data"
                    renderRow={(item, rowId, sectionId) => {
                        return (
                            <TouchableHighlight underlayColor='gray' onPress={() => this._navigateToDetailPage(item)}>
                                <SectionListItem  itemData={item} />
                            </TouchableHighlight> 
                            )
                        }
                    }
                    onRefreshStart={this.fetchNewsData.bind(this)}
                    renderSectionHeaderX={(section, sectionId) => <Text style={styles.sectionHeader}>{section}</Text> } 
                    openOptions={[0]}
                 />

                {/* <SectionList
                    stickySectionHeadersEnabled={true}
                    refreshing={ this.state.isLoading }
                    onRefresh={() => this.fetchNewsData()}
                    sections={ this.state.config }
                    renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text> }
                    renderItem={ ({item}) =>  
                        <TouchableHighlight underlayColor='gray' onPress={() => this._navigateToDetailPage(item)}>
                            <SectionListItem  itemData={item} />
                        </TouchableHighlight>  }
                    keyExtractor={ ({id}, index) => index }
                    /> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    centerItem: {
        alignItems: 'center',
        marginTop: 25
    },

    sectionHeader: {
        padding: 12,
        fontWeight: 'bold',
        fontSize: 14,
        backgroundColor: 'rgba(230,230,230,1.0)',
    },
    sectionItem: {
        marginTop: 6,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
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
                    <Text style={styles.sectionTitleText} numberOfLines={4}>{this.props.itemData.title}</Text>
                    <TimeAgo style={styles.sectionPublishedDate} time={this.props.itemData.pubDate} ></TimeAgo>
                </View>
            </View>
        )
    }

}
