# Background layout

cardBackground = new Layer
	width: Screen.width
	height: Screen.height
	backgroundColor: "#fff"
	borderRadius: 16
cardBackground.sendToBack()

title = new TextLayer
	x: Align.center
	y: 192
	width: Screen.width - 60
	text: "StoryComponent"
	fontSize: 36
	fontWeight: 800
	textAlign: "center"
	color: "#222"
	parent: cardBackground
description = new TextLayer
	x: Align.center
	y: 278
	width: Screen.width - 68
	text: "Tap the circle above to a set of stories. Tap the right of a story to advance or tap the left side to go backward.\r\n \r\n You can swipe up from the bottom at any time to exit the story or you will automatically return at the end of the set.\r\n \r\n To create a StoryComponent, initialize it with an array of images or videos. Begin playback by calling the start function."
	fontSize: 16
	fontWeight: 400
	textAlign: "center"
	parent: cardBackground
linkURL = new TextLayer
	x: Align.center
	y: 556
	width: Screen.width - 72
	text: "Learn More"
	fontSize: 15
	fontWeight: 500
	color: "#007AFF"
	textAlign: "center"
	parent: cardBackground

linkURL.onTap ->
	window.open('https://github.com/robotdestroy/StoryComponent', '_new')

storyPlaceholder1 = new Layer
	y: 56
	x: Align.center
	width: 82
	height: 82
	borderRadius: 82
	backgroundColor: "rgba(0,0,0,0.05)"
storyPlaceholder1.parent = cardBackground
storyPlaceholder2 = storyPlaceholder1.copy()
storyPlaceholder2.parent = cardBackground
storyPlaceholder3 = storyPlaceholder1.copy()
storyPlaceholder3.parent = cardBackground
storyPlaceholder4 = storyPlaceholder1.copy()
storyPlaceholder4.parent = cardBackground
storyPlaceholder1.x = ( storyPlaceholder1.x - 190 )
storyPlaceholder2.x = ( storyPlaceholder2.x - 95 )
storyPlaceholder3.x = ( storyPlaceholder3.x + 95 )
storyPlaceholder4.x = ( storyPlaceholder4.x + 190 )

{StoryComponent} = require "StoryComponent"

exampleSet = new StoryComponent
	progressBarHorizontalPadding: 12
	progressBarVerticalPadding: 12
	progressBarHeight: 4
	progressBarGradient: true
	timePerStory: 3
	stories: ["images/_x_link_small.png", "images/_x_link_med.png", "images/_x_link_large%20copy%202.png"]

# Setup story display

exampleSet.width = Screen.width
exampleSet.height = Screen.height
exampleSet.clip = true
exampleSet.shadowY = 8
exampleSet.shadowBlur = 60
exampleSet.shadowColor = "rgba(0,0,0,0.3)"

# Story viewer states

exampleSet.states.small =
	y: -90
	scale: 0.22
	height: Screen.width
	borderRadius: Screen.width/2
	borderColor: "#fff"
	borderWidth: 12

exampleSet.states.large =
	y: 0
	scale: 1
	height: Screen.height
	borderRadius: 12
	borderColor: "#000"
	borderWidth: 0

cardBackground.states.active =
	scale: 1
	brightness: 100

cardBackground.states.inactive =
	scale: 0.90
	brightness: 80

exampleSet.states.switchInstant "small"
cardBackground.states.switchInstant "active"

exampleSet.animationOptions =
	curve: "spring(230,28,7)"
	
cardBackground.animationOptions =
	curve: "spring(230,28,7)"

# Start story action

singleSwipe = 0

storyHit = new Layer
	width: 80
	height: 80
	x: 147
	y: 58
	opacity: 0

storyHit.onClick ->
	storyHit.scale = 0
	exampleSet.animate("large")
	cardBackground.animate("inactive")
	exampleSet._startStoriesPlayback()
	singleSwipe = 0

# End story listener to trigger return animation

exampleSet._endOfUpdatesEvent.on "change:x", ->
	if exampleSet._endOfUpdatesEvent.x == 1
		exampleSet.animate("small")
		cardBackground.animate("active")
		storyHit.scale = 1
		exampleSet._resetStoriesPlayback()
		exampleSet._endOfUpdatesEvent.x = 0

Screen.on Events.EdgeSwipeBottom, (event) ->
	if singleSwipe == 0
		exampleSet.animate("small")
		cardBackground.animate("active")
		exampleSet._resetStoriesPlayback()
		exampleSet._endOfUpdatesEvent.x = 0
		storyHit.scale = 1
		singleSwipe = 1
