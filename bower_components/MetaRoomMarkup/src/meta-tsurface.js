class MetaTsurfaceController extends MRM.MetaComponentController {
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();

    this.setupComponent();
    this.parent = dom.parentElement.controller;

    this.updateMetaObject()
  }

  get eventActionSettings(){
    return {
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
    }
  }

  get metaAttachedActions(){
    return {
      "attachMetaObject": true,
      "updateTableDimension": true,
      "updateTSurfaceVisibility": true
    }
  }

  get metaChildrenNames(){
    return ["meta-board", "meta-text", "meta-picture", "meta-table", "meta-item", "meta-video"]
  }

  get propertiesSettings() {
    return {
      thickness: {
        type: Number,
        default: 0.03,
        onChange: "updateMetaObject"
      },
      tableWidth: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },
      tableHeight: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      },
      tableLength: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },

      width: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      },
      length: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      }
    }
  }

  get tagName() {
    return "meta-tsurface"
  }

  updateDimension() {
    this.properties.width = this.properties.tableWidth
    this.properties.length = this.properties.tableLength
  }

  createMetaObject(){

    var group = new THREE.Group();
    return {
      group: group
    };
  }

  updateMetaObject(){
    this.metaObject.group.position.z = this.properties.tableHeight / 2;
    var eventToTriggerOnResize = this.updateChildrenDisplayInline();
    if(eventToTriggerOnResize){
      this.dom.dispatchEvent(eventToTriggerOnResize);
    }
  }

  updateTableChildrenDisplayInline(){
    var metaTsurface = this,
        children = this.getMetaChildren(),
        lineIndex = 0,
        currentLineWidth = 0,
        currentLineLength = 0,
        childrenInLine = [],
        totalLength = 0,
        eventToTriggerOnResize;
    function pushChildForChildrenDisplayInline(index, child){
      var childWidth = child.controller.properties.width, childLength = child.controller.properties.length;
      if(child.controller.metaStyle.metaStyle["margin"]){
        childWidth += 2 * child.controller.metaStyle.metaStyle["margin"];
        childLength += 2 * child.controller.metaStyle.metaStyle["margin"];
      }
      if(currentLineLength === 0){
        currentLineLength = childLength;
      }
      if(currentLineWidth + childWidth > (metaTsurface.parent.properties.width !== 0 ? metaTsurface.parent.properties.width : metaTsurface.parent.parent.properties.width)){
        totalLength += currentLineLength;
        currentLineWidth = 0;
        currentLineLength = childLength;
        lineIndex++;
      }
      if(checkResizeTable(childWidth, childLength)){
        var eventToTriggerOnResize;
        resizeTable(childWidth, childLength);
        eventToTriggerOnResize = new CustomEvent('size-attributes-change', {
          'detail' : {
            'controller' : metaTsurface
          },
          bubbles: true
        });
        if(index > 0){
          lineIndex = 0,
          currentLineWidth = 0,
          currentLineLength = 0,
          totalLength = 0;
          for(var i = 0; i < index; i++){
            var cWidth = children[i].controller.properties.width, cLength = children[i].controller.properties.length;
            if(children[i].controller.metaStyle.metaStyle["margin"]){
              cWidth += 2 * children[i].controller.metaStyle.metaStyle["margin"];
              cLength += 2 * children[i].controller.metaStyle.metaStyle["margin"];
            }
            if(currentLineWidth + cWidth > (metaTsurface.parent.properties.width !== 0 ? metaTsurface.parent.properties.width : metaTsurface.parent.parent.properties.width)){
              totalLength += currentLineLength;
              currentLineWidth = 0;
              currentLineLength = 0;
              lineIndex++;
            }
            if(currentLineLength < cLength){
              currentLineLength = cLength;
              _.forEach(childrenInLine[lineIndex], (child) =>{
                var width = child.controller.properties.width, length = child.controller.properties.length;
                if(child.controller.metaStyle.metaStyle["margin"]){
                  width += 2 * child.controller.metaStyle.metaStyle["margin"];
                  length += 2 * child.controller.metaStyle.metaStyle["margin"];
                }
                var group = child.controller.metaObject.group;
                group.position.y = (((metaTsurface.parent.computedProperties.length || 0) / 2) - totalLength) - (length / 2) -
                  (currentLineLength - length);
              });
            }
            calculateChildPosition(children[i]);
          }
        }
      }
      if(currentLineWidth + childWidth > (metaTsurface.parent.properties.width !== 0 ? metaTsurface.parent.properties.width : metaTsurface.parent.parent.properties.width)){
        totalLength += currentLineLength;
        currentLineWidth = 0;
        currentLineLength = 0;
        lineIndex++;
      }
      if(currentLineLength < childLength){
        currentLineLength = childLength;
        _.forEach(childrenInLine[lineIndex], (child) =>{
          var cWidth = child.controller.properties.width, cLength = child.controller.properties.length;
          if(child.controller.metaStyle.metaStyle["margin"]){
            cWidth += 2 * child.controller.metaStyle.metaStyle["margin"];
            cLength += 2 * child.controller.metaStyle.metaStyle["margin"];
          }
          var group = child.controller.metaObject.group;
          group.position.y = (((metaTsurface.parent.computedProperties.length || 0) / 2) - totalLength) - (cLength / 2) -
            (currentLineLength - cLength);
        });
      }
      calculateChildPosition(child);
      return eventToTriggerOnResize;
    }

    function checkResizeTable(childWidth, childLength){

      if(metaTsurface.parent.properties.width === 0 && metaTsurface.parent.properties.length === 0){
        if((metaTsurface.parent.computedProperties.width < (currentLineWidth + childWidth) &&
          (currentLineWidth + childWidth) <= metaTsurface.parent.parent.properties.width) ||
          (metaTsurface.parent.computedProperties.length < (currentLineLength + totalLength) &&
          (currentLineLength + totalLength) <= metaTsurface.parent.parent.properties.length)){
          return true;
        }
      }else if(metaTsurface.parent.properties.width === 0){
        if((currentLineWidth + childWidth) <= metaTsurface.parent.parent.properties.width){
          return true;
        }
      }else if(metaTsurface.parent.properties.length === 0){
        if(totalLength + currentLineLength <= metaTsurface.parent.parent.properties.width){
          return true;
        }
      }else {
        return false;
      }
    }

    function resizeTable(deltaX, deltaY){
      if(metaTsurface.parent.properties.width === 0 && metaTsurface.parent.properties.length === 0){
        // if(metaTsurface.parent.computedProperties.width + deltaX <= metaTsurface.parent.parent.properties.width){
        if(metaTsurface.parent.computedProperties.width < (currentLineWidth + deltaX) &&
          (currentLineWidth + deltaX) <= metaTsurface.parent.parent.properties.width){
          metaTsurface.parent.computedProperties.width += deltaX;
        }
        if((metaTsurface.parent.computedProperties.length < (currentLineLength + totalLength) &&
        (currentLineLength + totalLength) <= metaTsurface.parent.parent.properties.length)){
          metaTsurface.parent.computedProperties.length = totalLength + currentLineLength;
        }
      }
      else if(metaTsurface.parent.properties.width === 0){
        if((currentLineWidth + deltaX) <= metaTsurface.parent.parent.properties.width){
          metaTsurface.parent.computedProperties.width += deltaX;
        }
      }else{
        metaTsurface.parent.computedProperties.length = totalLength + currentLineLength;
      }
    }

    function calculateChildPosition(child){
      var x = 0, y = 0;
      var childWidth = child.controller.properties.width, childLength = child.controller.properties.length;
      if(child.controller.metaStyle["margin"]){
        childWidth += 2 * child.controller.metaStyle.metaStyle["margin"];
        childLength += 2 * child.controller.metaStyle.metaStyle["margin"];
      }
      x = currentLineWidth + (childWidth / 2) - ((metaTsurface.parent.computedProperties.width || 0) / 2);
      var group = child.controller.metaObject.group;
      group.position.x = x;
      currentLineWidth += childWidth;
      if(currentLineLength === childLength){
        y = ((metaTsurface.parent.computedProperties.length || 0)  / 2) - (totalLength + (currentLineLength / 2));
      }else{
        y = (((metaTsurface.parent.computedProperties.length || 0) / 2) - totalLength) - (childLength / 2) -
          (currentLineLength - childLength);
      }
      group.position.y = y;
      childrenInLine[lineIndex] = childrenInLine[lineIndex] || [];
      childrenInLine[lineIndex].push(child);
    }
    if(metaTsurface.parent){
      metaTsurface.parent.resetComputedProperties();
    }else{
      return;
    }
    _.forEach(children, (child, index) => {
      if (!child.controller){ return; }
      if(child.controller.hasOwnProperty("metaStyle")){
        if(child.controller.metaStyle['position'] === 'absolute'){
          return;
        }
      }
      var event = pushChildForChildrenDisplayInline(index, child);
      if(event){
        eventToTriggerOnResize = event;
      }
    });
    return eventToTriggerOnResize;
  }
}

class MetaTsurface extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaTsurfaceController(this);
    super.createdCallback();
  }

  metaDetached(e) {
    var targetController = e.detail.controller;
    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.group);
      var event = this.controller.updateTableChildrenDisplayInline();
      if(event){
        this.dispatchEvent(event);
      }
    }
  }

}

document.registerElement('meta-tsurface', MetaTsurface);
