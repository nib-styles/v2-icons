# v2-icons

Icons for nib pages.

    <i class="v2-icon v2-icon--smaller v2-icon--arrow-right-circle-white"></i>


## Build

The following software is required:

- nodejs
- gulp

Install node modules required for building:

    npm install

Run the build script:

    gulp

**Note**: `index.css` and `fonts/*` are generated files. Do not edit manually.

## Adding new icons

Add `*.svg` icons to the `images/` directory.

### Icon Naming

 - name after what the image is, not what the function is
 - if icons are in a circle, add the suffix `-circle`
 - if icons are white on black, add the suffix `-inverse`