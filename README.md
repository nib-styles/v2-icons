# v2-icons

Icon font for nib.

    <i class="v2-icon v2-icon--small v2-icon--lightgrey v2-icon--calendar"></i>
    
See the [pattern library](http://nib-pattern-library.azurewebsites.net/pages/iconography.html) for a full list of available icons.

## Designing a new icon

 - When *creating* in Illustrator, ensure your document profile has "Align New Objects to Pixel Grid" option unchecked in the Advanced section
 - Your icon *MUST* be a `*.svg`
 - Your icon *MUST* be 64px by 64px
 - Your icon *MUST* be black and white
 - You *SHOULD* make use of the full height of the icon; if you *absolutely* can't make use of the full height of the icon then you *MUST* center the icon vertically - but vertically centered icons may look dodgey in one or two common use cases (see below)
 - You *MUST* save your icon with [these settings](https://www.npmjs.com/package/gulp-iconfont#preparing-svg-s)

## Naming a new icon

 - name the icon after what the image is, not what the function is
 - if the icon is in a circle, use the suffix `-circle`
 - if the icon is white on black, use the suffix `-inverse`
 
## Adding a new icon

<span style="color:red;">
**Before adding your icon, please consult with the designers to ensure the icon is a standard and will be used across the teams!!!**
</span>

Add your `*.svg` to the `icons/` directory

Install the nodejs modules required for building:

    npm install

Run the build script:

    gulp

## Use cases

The above rules were chosen in order to meet the following use cases:

### Inline with text

![Icon in a button](doc/use-case-btn.png?raw=true)

Where the center of an icon should be in line with the center of some text e.g. an icon in a button. For this to look good icons must be vertically centered or make use of the full height. Icons that are vertically centered will look smaller than those that 

### Horizontal list

![Icon in a button](doc/use-case-horiz-list.png?raw=true)

Where a number of icons are aligned to the top or bottom of a container e.g. a feature panel. For this to look good icons must all be the same height (preferably make use of the full height).

### Vertical list

Where a number of icons are aligned to the left or right of a container. For this to look good icons must be horizontally centered or make use of the full width.
