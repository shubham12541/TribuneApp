import React from 'react';
import {View, Text, AsyncStorage, StyleSheet, ActivityIndicator, AppState, FlatList, Image, TouchableHighlight} from 'react-native';
import TimeAgo from 'react-native-timeago';
import Moment from 'moment';


export default class SavedStoriesScreen extends React.Component{

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: <Text style={{fontWeight: "bold", marginHorizontal: 4}}>Saved</Text>
        }
    }


    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            savedList: [],
            appState: AppState.currentState,
        };
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus', (route) => { 
            this._getAllSaved()
                .then(savedList => {
                    this.setState({
                        isLoading: false,
                        savedList: savedList ? JSON.parse(savedList) : []
                    });
                });
        });
    }

    componentWillUnmount(){
    }

    _handleAppStateChange = (nextAppState) => {
        if(this.state.appState.match(/inactive|background/) && nextAppState === 'active' ){
            
        }
        
        this.setState(prevState => {
            prevState.appState = nextAppState;
            return prevState;
        });
    }

    _getAllSaved = async () => {
        try{
            const savedList = await AsyncStorage.getItem("@SavedList");
            if(savedList){
                return savedList;
            } else{
                return null;
            }
        } catch(err){
            console.log(err);
            return null;
        }
    }


    _navigateToDetailPage(itemData){
        const {navigation} = this.props;
        navigation.navigate('SavedDetail', {itemData: itemData});
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

        if(this.state.savedList.length === 0){
            return(
                <View style={[styles.container]}>
                    <Text style={styles.noSavedStores}>No Saved Stories yet</Text>
                </View>
            )
        }

        return(
            <View style={styles.container}>
                <FlatList 
                        data={this.state.savedList}
                        keyExtractor={(item, index) => item.Articleid + ""}
                        renderItem={({item}) => 
                            <TouchableHighlight underlayColor='gray' onPress={() => this._navigateToDetailPage(item)}>
                                <ListItem itemData={item} />
                            </TouchableHighlight>
                        } 
                     />
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

    noSavedStores: {
        alignContent: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 28,
        paddingLeft: 12
    },

    sectionItem: {
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
        fontSize: 15,
        fontWeight: "500",
    },

    sectionPublishedDateTitle: {
        fontWeight: "400"
    },
    

    sectionPublishedDate: {
        fontSize: 12,
        fontWeight: '300',
        marginTop: 4,
        paddingLeft: 4
    }

});


class ListItem extends React.Component{

    constructor(props){
        super(props);
    }

   
    render(){
        Moment.locale('en');
        const defaultThumb = "https://lh3.googleusercontent.com/7CYIDjpL7SwqwSHARJ8SAEeNfGk7ZiEwNzWP01mfPxvV98Ku6i3wPHqADSrFDQDV5nCOA8Tv5QU=-p";

        return(
            <View style={{flex: 1, padding: 4}}>
                <Text style={{fontWeight: "bold", fontSize: 10, margin: 0, padding: 0, color: '#5E98CA'}}>{this.props.itemData.sectionTitle}</Text>
                <View style={styles.sectionItem}>
                    <Image source={{uri: this.props.itemData.thumbimage ? this.props.itemData.thumbimage : defaultThumb }} 
                        style={styles.thumbimage} />

                    <View style={{flex: 1}}>
                        <Text style={[styles.sectionTitleText]} numberOfLines={4}>{this.props.itemData.title}</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Text style={[styles.sectionPublishedDate, styles.sectionPublishedDateTitle]}>Saved: </Text>
                            <TimeAgo style={styles.sectionPublishedDate}  time={this.props.itemData.savedDate} ></TimeAgo>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}