import React, { Component } from "react";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview/web";

import "./ViewAllImg.scss";
import { DataCall } from "../../DataCall";
import ImageRenderer from "../../Components/ImageRenderer/ImageRenderer";
import { firestore } from "../../firebase.utils";

export default class ViewAllImg extends Component {
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
          dim.height = 450;
        }
      ),
      data: [],
      dataCall: new DataCall(firestore.collection('images')),
    };
    this.inProgressNetworkReq = false;
  }

  componentDidMount() {
    this.fetchMoreData();
  }

  async fetchMoreData() {
    if (!this.inProgressNetworkReq) {
      //To prevent redundant fetch requests. Needed because cases of quick up/down scroll can trigger onEndReached
      //more than once
      this.inProgressNetworkReq = true;
      const data = await this.state.dataCall.getMore();
      let newData=[]
      data.forEach((item,i) =>{
        if (i%3===0){
          newData.push([])
        }
        newData[newData.length-1].push(item)
      })
      this.inProgressNetworkReq = false;
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(
          this.state.data.concat(newData)
        ),
        data: this.state.data.concat(newData),
      });
    }
  }

  handleListEnd = () => {
    this.fetchMoreData();
    this.setState({})
  };

  rowRenderer = (type, data, index) => {
    return (
      <ImageRenderer
        id={Math.floor(Math.random() * 100000)}
        data={data}
        width={this.width}
      />
    );
  };

  render() {
    return (
      <div className="image-page">
        <h1 className="page-title">All Images</h1>
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
              onEndReachedThreshold={800}
              dataProvider={this.state.dataProvider}
              layoutProvider={this.state.layoutProvider}
              renderAheadOffset={800}
              rowRenderer={this.rowRenderer}
            />
          ) : (
            <h1>No Images Found !!</h1>
          )}
        </div>
      </div>
    );
  }
}
