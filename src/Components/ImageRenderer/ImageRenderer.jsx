import React from "react";
import "./ImageRenderer.scss";

function ImageRenderer(props) {
  return (
    <div className="image-renderer" style={{ width: `${props.width}px` }}>
      <div className="image-container">
        {props.data.map((element,i) => (
          <div
          key={i}
          className="img"
          style={{
            backgroundImage: `url(${element.url})`,
          }}
        ></div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ImageRenderer);
