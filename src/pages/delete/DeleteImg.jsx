import React, { Component } from "react";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview/web";

import "./DeleteImg.scss";
import { DataCall, deleteImage } from "../../DataCall";
import DelImgComponent from "../../Components/DelImgComponent/DelImgComponent";
import { auth, firestore } from "../../firebase.utils";

export default class DeleteImg extends Component {
  constructor(props) {
    super(props);
    this.width = 0;
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      layoutProvider: new LayoutProvider(
        () => {
          return "TEMP";
        },
        (type, dim) => {
          dim.width = window.innerWidth;
          dim.height = 400;
        }
      ),
      data: [],
      dataCall: null,
    };
    this.inProgressNetworkReq = false;
  }

  componentDidMount() {
    this.fetchUser();
  }

  async fetchUser() {
    const snapshot = await firestore.doc(`users/${auth.currentUser.uid}`).get();

    if (snapshot.exists) {
      const imageRef = firestore.collection(
        `users/${auth.currentUser.uid}/images`
      );
      this.setState({ dataCall: new DataCall(imageRef) });
    }
    this.fetchMoreData();
  }

  async fetchMoreData() {
    if (!this.inProgressNetworkReq) {
      //To prevent redundant fetch requests. Needed because cases of quick up/down scroll can trigger onEndReached
      //more than once
      this.inProgressNetworkReq = true;
      const data = await this.state.dataCall.getMore();
      this.inProgressNetworkReq = false;
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(
          this.state.data.concat(data)
        ),
        data: this.state.data.concat(data),
      });
    }
  }

  handleDelete = (index, data) => {
    console.log(data);
    let allData = this.state.data;
    allData.splice(index, 1);
    this.setState({
      dataProvider: this.state.dataProvider.cloneWithRows(allData),
      data: allData,
    });
    deleteImage(data.storageName, data.name);
  };

  handleListEnd = () => {
    this.fetchMoreData();
    this.setState({});
  };

  rowRenderer = (type, data, index) => (
    <DelImgComponent
      id={Math.floor(Math.random() * 100000)}
      data={data}
      index={index}
      width={this.width}
      handleDelete={this.handleDelete}
    />
  );

  render() {
    return (
      <div className="image-page">
        <h1 className="page-title">Your Images</h1>
        <div
          className="list-container"
          ref={(ref) => {
            this.width = ref?.getBoundingClientRect().width - 15;
          }}
        >
          {this.state.data.length ? (
            <RecyclerListView
              style={{ overflow: "hidden" }}
              useWindowScroll={true}
              onEndReached={this.handleListEnd}
              onEndReachedThreshold={500}
              dataProvider={this.state.dataProvider}
              layoutProvider={this.state.layoutProvider}
              renderAheadOffset={500}
              rowRenderer={this.rowRenderer}
              optimizeForInsertDeleteAnimations={true}
            />
          ) : (
            <h1>You Haven't Uploaded any Image !!</h1>
          )}
        </div>
      </div>
    );
  }
}
