# Sprite atlas

This is a web based sprite atlas packer and tileset extruder. You can use it at [https://jurmerlo.github.io/sprite-atlas](https://jurmerlo.github.io/sprite-atlas).  

## Sprite atlas
You can upload multiple png images and it will pack them into a single image of the smallest size possible. You can then download the image and a json file that has the position data for each individual image the atlas.

### Json data format
```json
{
  "frames": [
    {
      "filename": "string",
      "frame": {
        "x": "number",
        "y": "number",
        "width": "number",
        "height": "number"
      },
      "trimmed": "boolean",
      "sourceSize": {
        "x": "number",
        "y": "number",
        "width": "number",
        "height": "number"
      }
    }
  ]
}
```

The `name` is the name of the image without the extension.  
The `frame` is the rectangle of the image inside the atlas.  
`trimmed` is `true` when the transparent pixels are trimmed off the source image.  
In the `sourceSize` the `x` and `y` store the offset of the transparent pixels that were removed from the top left. The `width` and `height` are the original `width` and `height` before trimming the transparent pixels.

## Tileset extruder
You can upload a tileset and extrude each tile inside the image. This can be useful when you have texture edge bleeding issues when rendering tiles.
