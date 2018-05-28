# **U**ltra **S**erver **S**ide **R**endering
Increasing performance by leveraging renderization of the webpage onto the back-end

## How does USSR work?

Developers worldwide seek to increase every millisecond of performance they can when it comes to the web. With the trend of single-page applications comes [frameworks that render parts of said application in the back-end for better performance.](https://universal.angular.io/)

We thought: why stop at preload? **USSR (Ultra Server Side Rendering) loads the entire webpage in the back-end, transferring rendered frames to the front-end.**

## Benefits

### Faster Performance

Horizontally shart this library on a serverless architecture and have parallel processes rendering each frame. Bombard the browser with said frames to achieve higher frame rates. Since a JavaScript tick is 1ms, 1000 fps is the theoretical maximum this baby can perform.

### Consistency

Who cares about Internet Explorer? By leveraging headless Chromium to delicately render each frame, developers only have to worry about one browser.

### Power to the People

When the website is rendered in the back-end, no longer do consumers have to worry about those nasty ad sites tracking their movements.

### Ultimate Anti-Adblock

Since frames are delivered to the browser as an image, there's no way for Adblock to block your ads. Use this newly gained money to invest more infrastructure into USSR!
