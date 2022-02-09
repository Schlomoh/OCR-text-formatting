# Basic react app to test reformatting text that was read out of an image using tesseract.js

The goal of this project is to generarte an html or pdf document with similar formatting to the image document: text placement and text size ratios.

## The idea

Since using tesseract.js has the advantage of a huge support of different languages and, (after loading the model) fairly fast recognition speeds, it was the first choice to use for analyzing scans and images of pure text documents like contracts.

Tesseract.js creates a results object that *does* include the position of each text block, line, word, down to the character. But using those coordinates often resulted in a document that does not look all too clean but rather a bit crooked.

So to solve this and create a clean, formatted and styled document I used the resulting coordinates and strings to find out the size of each line, their distance to one another and completely recreated the document using html text elements (also removing incomplete lines or falsely interpreted blemishes of the original document).  


## Including

The re-formatting of the strings captured using the tesseract OCR engine works fine. 
The latest addition to this project was the incorporation of a pdf library to read out text if present in a pdf. Additionally it should potentially create a PDF off any reformatted text.

This project also includes a small approach to test the 'smart-reply' tfLite model. This was just out of convenience since i found it interesting to play around with and already set up a small frontend. But it is not working nor implemented in the ui rn.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
