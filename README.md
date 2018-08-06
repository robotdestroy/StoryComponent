# StoryComponent

A generic story component for [Framer](https://framer.com/). The component can be called multiple times to create sequences of stories.

## Example Usage
The simpliest way to use StoryComponent is to import the module and define an array of images.

```coffee
{StoryComponent} = require "StoryComponent"
exampleSet = new StoryComponent
	stories: [ "images/1.png", "images/2.png", "images/3.png" ]
```

The component will rescale to any device size automatically. There are also a number of variables you can customize in the component.

## Customization
```coffee
{StoryComponent} = require "StoryComponent"
exampleSet = new StoryComponent
	progressBarHorizontalPadding: 12
	progressBarVerticalPadding: 12
	progressBarHeight: 4
	progressBarGradient: true
	timePerStory: 3
	stories: [ "images/1.png", "images/2.png", "images/3.png" ]
```

## Style
Define the horizontal padding of the progress bar:

```coffee
progressBarHorizontalPadding: <int>
```

Define the vertical padding of the progress bar:

```coffee
progressBarVerticalPadding: <int>
```

Define the height of the progress bar:

```coffee
progressBarHeight: <int>
```

Define if there is a gradient behind progress bar:

```coffee
progressBarGradient: <bool>
```

## Time
Define the time each story is shown:

```coffee
timePerStory: <int>
```

## Listener
You can listen for the completion of a set of stories using:

```coffee
example._endOfUpdatesEvent.on "change:x", ->
	if example._endOfUpdatesEvent.x == 1
		print "End of stories"
```

## Actions
You can start the playback of a set of stories using:

```coffee
example._startStoriesPlayback()
```

You can stop the story playback using:

```coffee
example._stopStoriesPlayback()
```

You can reset the story set using:

```coffee
example._resetStoriesPlayback()
```

## Demo Video
- [YouTube](https://www.youtube.com/watch?v=YoTI_EC1he8)
