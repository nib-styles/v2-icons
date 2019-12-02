# v2-icons

Icon font for nib.

    <i class="v2-icon v2-icon--small v2-icon--lightgrey v2-icon--calendar"></i>

See the [pattern library](https://design.nib.com.au/language/master/#/atom/icon) for a full list of available icons.

## Designing a new icon

 - Ensure your document profile has "Align New Objects to Pixel Grid" option unchecked in the Advanced section. NOTE: This will only work when creating a new illustrator document.
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

### Test

Open the `dist/listing.html` file.  It will take a while to load. 

## Use cases

The above rules were chosen in order to meet the following use cases:

### Inline with text

![Icon in a button](doc/use-case-btn.png?raw=true)

Where the center of an icon should be in line with the center of some text e.g. an icon in a button. For this to look good icons must be vertically centered or make use of the full height. Icons that are vertically centered rather than using the full height will look smaller than those that are full height.

### Horizontal list

![Icon in a button](doc/use-case-horiz-list.png?raw=true)

Where a number of icons are aligned to the top or bottom of a container e.g. a feature panel. For this to look good icons must all be the same height (preferably make use of the full height).

### Vertical list

Where a number of icons are aligned to the left or right of a container. For this to look good icons must be horizontally centered or make use of the full width.

## Change log

### 3.4.1
- Add: Font-display to @font-face to make text visible while the font is loading

### 3.4.0
- Add: `glasses`, `smiley` and `arm-around-shoulder` icons

### 3.3.0
- Add: `hospital-building` and `paper-plane` icons

### 3.2.0
- Add: `clipboard` and `receipt-with-inverse-plus` icons

### 3.1.0
- Add: `travel-bag` icon

### 3.0.0

- move `font-family` to its own mixin so its not repeated in CSS each time the mixins are `@import`ed
- change the `sass-composer` main file to the `mixins.scss` rather than `compiled.scss`
- fix `lightgrey` color to be standard https://github.com/nib-styles/v2-icons/issues/18
- turn off italics so the icon doesn't look skewed https://github.com/nib-styles/v2-icons/issues/17

### 2.12.1

- Add: `credit-card` icon

### 2.11.0

- Add: PDF icon
- Add: certificate icon

### 2.8.0

- Add: added `./dist/metadata.js`: generated metadata for use in JS
