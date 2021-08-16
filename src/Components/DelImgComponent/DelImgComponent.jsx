import React from "react";
import Button from "../button/button.component";
import "./DelImgComponent.scss";

function DelImgComponent(props) {
  let type = props.data.storageName.split(".");
  type = type[type.length - 1];
  return (
    <div className="image-component" style={{ width: `${props.width}px` }}>
      <div className="image-container">
        <div
          className="img"
          style={{
            backgroundImage: `url(${props.data.url})`,
          }}
        ></div>
      </div>
      <div className="image-data">
        <p className="data">{props.data.name + "." + type}</p>
      </div>
      <div>
        <Button
          onClick={() => {
            props.handleDelete(props.index, props.data);
          }}
          inverted={true}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default React.memo(DelImgComponent);
