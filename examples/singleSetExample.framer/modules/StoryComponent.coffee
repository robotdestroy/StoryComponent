###
	# Story Component

	# Example
	{StoryComponent} = require "StoryComponent"
	exampleSet = new StoryComponent
		progressBarHorizontalPadding: 12
		progressBarVerticalPadding: 12
		progressBarHeight: 4
		progressBarGradient: true
		timePerStory: 3
		stories: [ "images/1.png", "images/2.png", "images/3.png" ]
###

class exports.StoryComponent extends Layer
	constructor: (@options={}) ->

		options = _.defaults @options,
			progressBarHorizontalPadding: 12
			progressBarVerticalPadding: 12
			progressBarHeight: 4
			progressBarGradient: true
			timePerStory: 3
			stories: [""]

		super @options

		@_numberOfUpdates = @options.stories.length
		@_totalTime = ( @_numberOfUpdates * @options.timePerStory )

		@_setupLayout()

	_setupLayout: =>

		longPress = false
		currentStoryOfAuthor = 1
		timePerStory = @options.timePerStory
		numberOfUpdates = @options.stories.length

		# Layout construction

		@_storiesContainer = new Layer
			backgroundColor: "#292929"
			width: Screen.width
			height: Screen.height
			name: "Stories Container"
			parent: this
			clip: true

		# Hit areas construction

		@_nextHit = new Layer
			width: Screen.width / 1.5
			height: Screen.height
			x: Align.right
			backgroundColor: "rgba(0,0,0,0)"
			name: "Next hit"
			parent: @_storiesContainer

		@_backHit = new Layer
			width: Screen.width / 3
			height: Screen.height
			x: Align.left
			backgroundColor: "rgba(0,0,0,0)"
			name: "Back hit"
			parent: @_storiesContainer

		@_endOfUpdatesEvent = new Layer
			width: 1
			height: 1
			x: 0
			y: 0
			backgroundColor: "rgba(0,0,0,0)"
			name: "Variable Holder"
			parent: @_storiesContainer

		# Widths values for progress

		@_progressBarHolderInitialWidth = ( Screen.width ) - ( @options.progressBarHorizontalPadding * 2 )
		@_progressBarHolderInitialSectionWidth = ( @_progressBarHolderInitialWidth / @_numberOfUpdates )

		# Progress bar construction

		@_progressBarHolder = new Layer
			height: @options.progressBarHeight
			width: @_progressBarHolderInitialWidth
			x: Align.center
			y: @options.progressBarVerticalPadding
			backgroundColor: "#00ffffff"
			name: "Progress Bar Holder"
			parent: @_storiesContainer

		# Single author's stories holder constructions

		@_authorStoryHolder = new Layer
			width: Screen.width * @_numberOfUpdates
			height: Screen.height
			name: "Auther's Stories Holder"
			parent: @_storiesContainer
		@_authorStoryHolder.placeBehind(@_progressBarHolder)
		authorStoryHolder = @_authorStoryHolder

		progressBarHolderInitialWidth = @_progressBarHolderInitialWidth
		progressBarHolderForLoop = @_progressBarHolder
		progressBarHolderInitialSectionWidthForLoop = @_progressBarHolderInitialSectionWidth

		# Generate progress and determine current story position for author
		@_progressBarHolder.onChange "width", ->
			authorProgress = Utils.modulate(this.width, [0, progressBarHolderInitialWidth], [0, 1])
			for number in [0...numberOfUpdates]
				if ( ( progressBarHolderForLoop.width < ( progressBarHolderInitialWidth * ( number + 1 ) ) ) && ( progressBarHolderForLoop.width > ( progressBarHolderInitialSectionWidthForLoop * ( number ) ) ) )
					currentStoryOfAuthor = number + 1
					authorStoryHolder.x = ( - Screen.width * number )

		# Generate stories and progress bar sections

		if ( @_numberOfUpdates > 1 )
			# For more than one update create segments and space evenly
			numberOfUpdates = @_numberOfUpdates
			for number in [0...numberOfUpdates]
				@_story = new Layer
					backgroundColor: Utils.randomColor()
					image: @options.stories[number]
					width: Screen.width
					height: Screen.height
					x: Screen.width * number
					parent: @_authorStoryHolder
				@_story.name = "Story " + ( number + 1 )
				@_progressBarSection = new Layer
					backgroundColor: "#ffffff"
					height: @options.progressBarHeight
					width: (@_progressBarHolder.width-@options.progressBarHorizontalPadding) / ( @_numberOfUpdates )
					x: number * ( ( @_progressBarHolder.width / @_numberOfUpdates ) + ( ( @options.progressBarHorizontalPadding / 2 ) / @_numberOfUpdates ) )
					borderRadius: @options.progressBarHeight
					parent: @_progressBarHolder
				@_progressBarSection.name = "Progress Bar Section " + number
		else
			# For one update create full width segment
			@_story1 = new Layer
				backgroundColor: Utils.randomColor()
				image: @options.stories[0]
				width: Screen.width
				height: Screen.height
				x: 0
				parent: @_authorStoryHolder
				name: "Story"
			@_progressBarSection1 = new Layer
				backgroundColor: "#ffffff"
				height: @options.progressBarHeight
				width: @_progressBarHolder.width
				x: Align.left
				borderRadius: @options.progressBarHeight
				parent: @_progressBarHolder

		# Create duplicate progress bar and optional gradient for background

		@_progressBarHolderBG = @_progressBarHolder.copy()
		@_progressBarHolderBG.name = "Progress Bar Holder Background"
		@_progressBarHolderBG.opacity = 0.25
		@_progressBarHolderBG.parent = @_storiesContainer

		if ( @options.progressBarGradient == true )
			@_progressBarBackgroundGradient = new Layer
				width: Screen.width
				height: ( @options.progressBarVerticalPadding * 2 ) + ( @options.progressBarHeight + 4 )
				gradient:
					start: "rgba(0,0,0,0)"
					end: "rgba(0,0,0,0.3)"
				name: "Progress Bar Gradient"
				parent: @_storiesContainer

		@_progressBarHolderBG.bringToFront()
		@_progressBarHolder.bringToFront()

		# Progress bar clipping for animation

		@_progressBarHolder.clip = true
		@_progressBarHolder.width = 0

		# Touch actions

		@_nextHit.onTouchStart =>
			@_stopStoriesPlayback()

		@_backHit.onTouchStart =>
			@_stopStoriesPlayback()

		@_nextHit.progressBarHolder = @_progressBarHolder
		@_nextHit.progressBarHolderBG = @_progressBarHolderBG
		@_nextHit.numberOfUpdates = @_numberOfUpdates

		@_backHit.progressBarHolder = @_progressBarHolder
		@_backHit.progressBarHolderBG = @_progressBarHolderBG
		@_backHit.numberOfUpdates = @_numberOfUpdates

		@_nextHit.onTouchEnd =>
			if longPress == false
				@_progressBarHolder.width = ( @_progressBarHolderBG.width / numberOfUpdates ) * ( currentStoryOfAuthor )
				currentStoryOfAuthor++
				if currentStoryOfAuthor >= numberOfUpdates
					currentStoryOfAuthor = currentStoryOfAuthor
				@_totalTime = ( ( numberOfUpdates - ( currentStoryOfAuthor - 1 ) ) * timePerStory )
				@_startStoriesPlayback()
			else
				@_startStoriesPlayback()
				longPress = false

		@_backHit.onTouchEnd =>
			if longPress == false
				if currentStoryOfAuthor > 1
					@_progressBarHolder.width = ( @_progressBarHolderBG.width / numberOfUpdates ) * ( currentStoryOfAuthor - 2 )
				currentStoryOfAuthor--
				if currentStoryOfAuthor < 1
					currentStoryOfAuthor = 1
				@_totalTime = ( ( numberOfUpdates - ( currentStoryOfAuthor - 1 ) ) * timePerStory )
				@_startStoriesPlayback()
			else
				@_startStoriesPlayback()
				longPress = false

		@_nextHit.onLongPress ->
			longPress = true

		@_backHit.onLongPress ->
			longPress = true

	_startStoriesPlayback: ->
		@_progressBarHolderAnimation = @_progressBarHolder.animate
			properties:
				width: Screen.width
			curve: Bezier.linear
			time: @_totalTime
		@_progressBarHolderAnimation.on Events.AnimationEnd, (animation, layer) =>
			@_endOfUpdatesEvent.x = 1

	_stopStoriesPlayback: ->
		@_progressBarHolderAnimation.stop()

	_resetStoriesPlayback: ->
		@_progressBarHolderAnimation.finish()
		@_progressBarHolderAnimation.reset()