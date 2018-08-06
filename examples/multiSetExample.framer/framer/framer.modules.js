require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"StoryComponent":[function(require,module,exports){

/*
	 * Story Component

	 * Example usage
	{StoryComponent} = require "StoryComponent"
	exampleSet = new StoryComponent
		progressBarHorizontalPadding: 12
		progressBarVerticalPadding: 12
		progressBarHeight: 4
		progressBarGradient: true
		timePerStory: 3
		stories: [ "images/1.png", "images/2.png", "images/3.png" ]

	 * Listen for story completion event
	example._endOfUpdatesEvent.on "change:x", ->
		if example._endOfUpdatesEvent.x == 1

	 * Start story playback
	example._startStoriesPlayback()

	 * Stop story playback
	example._stopStoriesPlayback()
	
	 * Reset story playback
	example._resetStoriesPlayback()
 */
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.StoryComponent = (function(superClass) {
  extend(StoryComponent, superClass);

  function StoryComponent(options1) {
    var options;
    this.options = options1 != null ? options1 : {};
    this._setupLayout = bind(this._setupLayout, this);
    options = _.defaults(this.options, {
      progressBarHorizontalPadding: 12,
      progressBarVerticalPadding: 12,
      progressBarHeight: 4,
      progressBarGradient: true,
      timePerStory: 3,
      stories: [""]
    });
    StoryComponent.__super__.constructor.call(this, this.options);
    this._numberOfUpdates = this.options.stories.length;
    this._totalTime = this._numberOfUpdates * this.options.timePerStory;
    this._setupLayout();
  }

  StoryComponent.prototype._setupLayout = function() {
    var authorStoryHolder, currentStoryOfAuthor, i, longPress, number, numberOfUpdates, progressBarHolderForLoop, progressBarHolderInitialSectionWidthForLoop, progressBarHolderInitialWidth, ref, timePerStory;
    longPress = false;
    currentStoryOfAuthor = 1;
    timePerStory = this.options.timePerStory;
    numberOfUpdates = this.options.stories.length;
    this._storiesContainer = new Layer({
      backgroundColor: "#292929",
      width: Screen.width,
      height: Screen.height,
      name: "Stories Container",
      parent: this,
      clip: true
    });
    this._nextHit = new Layer({
      width: Screen.width / 1.5,
      height: Screen.height,
      x: Align.right,
      backgroundColor: "rgba(0,0,0,0)",
      name: "Next hit",
      parent: this._storiesContainer
    });
    this._backHit = new Layer({
      width: Screen.width / 3,
      height: Screen.height,
      x: Align.left,
      backgroundColor: "rgba(0,0,0,0)",
      name: "Back hit",
      parent: this._storiesContainer
    });
    this._endOfUpdatesEvent = new Layer({
      width: 1,
      height: 1,
      x: 0,
      y: 0,
      backgroundColor: "rgba(0,0,0,0)",
      name: "Variable Holder",
      parent: this._storiesContainer
    });
    this._progressBarHolderInitialWidth = Screen.width - (this.options.progressBarHorizontalPadding * 2);
    this._progressBarHolderInitialSectionWidth = this._progressBarHolderInitialWidth / this._numberOfUpdates;
    this._progressBarHolder = new Layer({
      height: this.options.progressBarHeight,
      width: this._progressBarHolderInitialWidth,
      x: Align.center,
      y: this.options.progressBarVerticalPadding,
      backgroundColor: "#00ffffff",
      name: "Progress Bar Holder",
      parent: this._storiesContainer
    });
    this._authorStoryHolder = new Layer({
      width: Screen.width * this._numberOfUpdates,
      height: Screen.height,
      name: "Auther's Stories Holder",
      parent: this._storiesContainer
    });
    this._authorStoryHolder.placeBehind(this._progressBarHolder);
    authorStoryHolder = this._authorStoryHolder;
    progressBarHolderInitialWidth = this._progressBarHolderInitialWidth;
    progressBarHolderForLoop = this._progressBarHolder;
    progressBarHolderInitialSectionWidthForLoop = this._progressBarHolderInitialSectionWidth;
    this._progressBarHolder.onChange("width", function() {
      var authorProgress, i, number, ref, results;
      authorProgress = Utils.modulate(this.width, [0, progressBarHolderInitialWidth], [0, 1]);
      results = [];
      for (number = i = 0, ref = numberOfUpdates; 0 <= ref ? i < ref : i > ref; number = 0 <= ref ? ++i : --i) {
        if ((progressBarHolderForLoop.width < (progressBarHolderInitialWidth * (number + 1))) && (progressBarHolderForLoop.width > (progressBarHolderInitialSectionWidthForLoop * number))) {
          results.push(authorStoryHolder.x = -Screen.width * number);
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
    if (this._numberOfUpdates > 1) {
      numberOfUpdates = this._numberOfUpdates;
      for (number = i = 0, ref = numberOfUpdates; 0 <= ref ? i < ref : i > ref; number = 0 <= ref ? ++i : --i) {
        this._story = new Layer({
          backgroundColor: Utils.randomColor(),
          image: this.options.stories[number],
          width: Screen.width,
          height: Screen.height,
          x: Screen.width * number,
          parent: this._authorStoryHolder
        });
        this._story.name = "Story " + (number + 1);
        this._progressBarSection = new Layer({
          backgroundColor: "#ffffff",
          height: this.options.progressBarHeight,
          width: (this._progressBarHolder.width - this.options.progressBarHorizontalPadding) / this._numberOfUpdates,
          x: number * ((this._progressBarHolder.width / this._numberOfUpdates) + ((this.options.progressBarHorizontalPadding / 2) / this._numberOfUpdates)),
          borderRadius: this.options.progressBarHeight,
          parent: this._progressBarHolder
        });
        this._progressBarSection.name = "Progress Bar Section " + number;
      }
    } else {
      this._story1 = new Layer({
        backgroundColor: Utils.randomColor(),
        image: this.options.stories[0],
        width: Screen.width,
        height: Screen.height,
        x: 0,
        parent: this._authorStoryHolder,
        name: "Story"
      });
      this._progressBarSection1 = new Layer({
        backgroundColor: "#ffffff",
        height: this.options.progressBarHeight,
        width: this._progressBarHolder.width,
        x: Align.left,
        borderRadius: this.options.progressBarHeight,
        parent: this._progressBarHolder
      });
    }
    this._progressBarHolderBG = this._progressBarHolder.copy();
    this._progressBarHolderBG.name = "Progress Bar Holder Background";
    this._progressBarHolderBG.opacity = 0.25;
    this._progressBarHolderBG.parent = this._storiesContainer;
    if (this.options.progressBarGradient === true) {
      this._progressBarBackgroundGradient = new Layer({
        width: Screen.width,
        height: (this.options.progressBarVerticalPadding * 2) + (this.options.progressBarHeight + 4),
        gradient: {
          start: "rgba(0,0,0,0)",
          end: "rgba(0,0,0,0.3)"
        },
        name: "Progress Bar Gradient",
        parent: this._storiesContainer
      });
    }
    this._progressBarHolderBG.bringToFront();
    this._progressBarHolder.bringToFront();
    this._progressBarHolder.clip = true;
    this._progressBarHolder.width = 0;
    this._nextHit.onTouchStart((function(_this) {
      return function() {
        return _this._stopStoriesPlayback();
      };
    })(this));
    this._backHit.onTouchStart((function(_this) {
      return function() {
        return _this._stopStoriesPlayback();
      };
    })(this));
    this._nextHit.progressBarHolder = this._progressBarHolder;
    this._nextHit.progressBarHolderBG = this._progressBarHolderBG;
    this._nextHit.numberOfUpdates = this._numberOfUpdates;
    this._backHit.progressBarHolder = this._progressBarHolder;
    this._backHit.progressBarHolderBG = this._progressBarHolderBG;
    this._backHit.numberOfUpdates = this._numberOfUpdates;
    this._nextHit.onTouchEnd((function(_this) {
      return function() {
        if (longPress === false) {
          _this._progressBarHolder.width = (_this._progressBarHolderBG.width / numberOfUpdates) * currentStoryOfAuthor;
          currentStoryOfAuthor++;
          if (currentStoryOfAuthor >= numberOfUpdates) {
            currentStoryOfAuthor = currentStoryOfAuthor;
          }
          _this._totalTime = (numberOfUpdates - (currentStoryOfAuthor - 1)) * timePerStory;
          return _this._startStoriesPlayback();
        } else {
          _this._startStoriesPlayback();
          return longPress = false;
        }
      };
    })(this));
    this._backHit.onTouchEnd((function(_this) {
      return function() {
        if (longPress === false) {
          if (currentStoryOfAuthor > 1) {
            _this._progressBarHolder.width = (_this._progressBarHolderBG.width / numberOfUpdates) * (currentStoryOfAuthor - 2);
          }
          currentStoryOfAuthor--;
          if (currentStoryOfAuthor < 1) {
            currentStoryOfAuthor = 1;
          }
          _this._totalTime = (numberOfUpdates - (currentStoryOfAuthor - 1)) * timePerStory;
          return _this._startStoriesPlayback();
        } else {
          _this._startStoriesPlayback();
          return longPress = false;
        }
      };
    })(this));
    this._nextHit.onLongPress(function() {
      return longPress = true;
    });
    return this._backHit.onLongPress(function() {
      return longPress = true;
    });
  };

  StoryComponent.prototype._startStoriesPlayback = function() {
    this._progressBarHolderAnimation = this._progressBarHolder.animate({
      properties: {
        width: Screen.width
      },
      curve: Bezier.linear,
      time: this._totalTime
    });
    return this._progressBarHolderAnimation.on(Events.AnimationEnd, (function(_this) {
      return function(animation, layer) {
        return _this._endOfUpdatesEvent.x = 1;
      };
    })(this));
  };

  StoryComponent.prototype._stopStoriesPlayback = function() {
    return this._progressBarHolderAnimation.stop();
  };

  StoryComponent.prototype._resetStoriesPlayback = function() {
    this._progressBarHolderAnimation.finish();
    return this._progressBarHolderAnimation.reset();
  };

  return StoryComponent;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2NoYXJsaWVkZWV0cy9Ecm9wYm94IChQZXJzb25hbCkvRGVzaWduL0ZyYW1lci9TdG9yeUNvbXBvbmVudC9TdG9yeUNvbXBvbmVudC9leGFtcGxlcy9tdWx0aVNldEV4YW1wbGUuZnJhbWVyL21vZHVsZXMvU3RvcnlDb21wb25lbnQuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblx0IyBTdG9yeSBDb21wb25lbnRcblxuXHQjIEV4YW1wbGUgdXNhZ2Vcblx0e1N0b3J5Q29tcG9uZW50fSA9IHJlcXVpcmUgXCJTdG9yeUNvbXBvbmVudFwiXG5cdGV4YW1wbGVTZXQgPSBuZXcgU3RvcnlDb21wb25lbnRcblx0XHRwcm9ncmVzc0Jhckhvcml6b250YWxQYWRkaW5nOiAxMlxuXHRcdHByb2dyZXNzQmFyVmVydGljYWxQYWRkaW5nOiAxMlxuXHRcdHByb2dyZXNzQmFySGVpZ2h0OiA0XG5cdFx0cHJvZ3Jlc3NCYXJHcmFkaWVudDogdHJ1ZVxuXHRcdHRpbWVQZXJTdG9yeTogM1xuXHRcdHN0b3JpZXM6IFsgXCJpbWFnZXMvMS5wbmdcIiwgXCJpbWFnZXMvMi5wbmdcIiwgXCJpbWFnZXMvMy5wbmdcIiBdXG5cblx0IyBMaXN0ZW4gZm9yIHN0b3J5IGNvbXBsZXRpb24gZXZlbnRcblx0ZXhhbXBsZS5fZW5kT2ZVcGRhdGVzRXZlbnQub24gXCJjaGFuZ2U6eFwiLCAtPlxuXHRcdGlmIGV4YW1wbGUuX2VuZE9mVXBkYXRlc0V2ZW50LnggPT0gMVxuXG5cdCMgU3RhcnQgc3RvcnkgcGxheWJhY2tcblx0ZXhhbXBsZS5fc3RhcnRTdG9yaWVzUGxheWJhY2soKVxuXG5cdCMgU3RvcCBzdG9yeSBwbGF5YmFja1xuXHRleGFtcGxlLl9zdG9wU3Rvcmllc1BsYXliYWNrKClcblx0XG5cdCMgUmVzZXQgc3RvcnkgcGxheWJhY2tcblx0ZXhhbXBsZS5fcmVzZXRTdG9yaWVzUGxheWJhY2soKVxuXG4jIyNcblxuY2xhc3MgZXhwb3J0cy5TdG9yeUNvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHRvcHRpb25zID0gXy5kZWZhdWx0cyBAb3B0aW9ucyxcblx0XHRcdHByb2dyZXNzQmFySG9yaXpvbnRhbFBhZGRpbmc6IDEyXG5cdFx0XHRwcm9ncmVzc0JhclZlcnRpY2FsUGFkZGluZzogMTJcblx0XHRcdHByb2dyZXNzQmFySGVpZ2h0OiA0XG5cdFx0XHRwcm9ncmVzc0JhckdyYWRpZW50OiB0cnVlXG5cdFx0XHR0aW1lUGVyU3Rvcnk6IDNcblx0XHRcdHN0b3JpZXM6IFtcIlwiXVxuXG5cdFx0c3VwZXIgQG9wdGlvbnNcblxuXHRcdEBfbnVtYmVyT2ZVcGRhdGVzID0gQG9wdGlvbnMuc3Rvcmllcy5sZW5ndGhcblx0XHRAX3RvdGFsVGltZSA9ICggQF9udW1iZXJPZlVwZGF0ZXMgKiBAb3B0aW9ucy50aW1lUGVyU3RvcnkgKVxuXG5cdFx0QF9zZXR1cExheW91dCgpXG5cblx0X3NldHVwTGF5b3V0OiA9PlxuXG5cdFx0bG9uZ1ByZXNzID0gZmFsc2Vcblx0XHRjdXJyZW50U3RvcnlPZkF1dGhvciA9IDFcblx0XHR0aW1lUGVyU3RvcnkgPSBAb3B0aW9ucy50aW1lUGVyU3Rvcnlcblx0XHRudW1iZXJPZlVwZGF0ZXMgPSBAb3B0aW9ucy5zdG9yaWVzLmxlbmd0aFxuXG5cdFx0IyBMYXlvdXQgY29uc3RydWN0aW9uXG5cblx0XHRAX3N0b3JpZXNDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjkyOTI5XCJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdFx0bmFtZTogXCJTdG9yaWVzIENvbnRhaW5lclwiXG5cdFx0XHRwYXJlbnQ6IHRoaXNcblx0XHRcdGNsaXA6IHRydWVcblxuXHRcdCMgSGl0IGFyZWFzIGNvbnN0cnVjdGlvblxuXG5cdFx0QF9uZXh0SGl0ID0gbmV3IExheWVyXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoIC8gMS41XG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdHg6IEFsaWduLnJpZ2h0XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgwLDAsMCwwKVwiXG5cdFx0XHRuYW1lOiBcIk5leHQgaGl0XCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHRAX2JhY2tIaXQgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGggLyAzXG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdHg6IEFsaWduLmxlZnRcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDAsMCwwLDApXCJcblx0XHRcdG5hbWU6IFwiQmFjayBoaXRcIlxuXHRcdFx0cGFyZW50OiBAX3N0b3JpZXNDb250YWluZXJcblxuXHRcdEBfZW5kT2ZVcGRhdGVzRXZlbnQgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiAxXG5cdFx0XHRoZWlnaHQ6IDFcblx0XHRcdHg6IDBcblx0XHRcdHk6IDBcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDAsMCwwLDApXCJcblx0XHRcdG5hbWU6IFwiVmFyaWFibGUgSG9sZGVyXCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHQjIFdpZHRocyB2YWx1ZXMgZm9yIHByb2dyZXNzXG5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoID0gKCBTY3JlZW4ud2lkdGggKSAtICggQG9wdGlvbnMucHJvZ3Jlc3NCYXJIb3Jpem9udGFsUGFkZGluZyAqIDIgKVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsU2VjdGlvbldpZHRoID0gKCBAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoIC8gQF9udW1iZXJPZlVwZGF0ZXMgKVxuXG5cdFx0IyBQcm9ncmVzcyBiYXIgY29uc3RydWN0aW9uXG5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyID0gbmV3IExheWVyXG5cdFx0XHRoZWlnaHQ6IEBvcHRpb25zLnByb2dyZXNzQmFySGVpZ2h0XG5cdFx0XHR3aWR0aDogQF9wcm9ncmVzc0JhckhvbGRlckluaXRpYWxXaWR0aFxuXHRcdFx0eDogQWxpZ24uY2VudGVyXG5cdFx0XHR5OiBAb3B0aW9ucy5wcm9ncmVzc0JhclZlcnRpY2FsUGFkZGluZ1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiMwMGZmZmZmZlwiXG5cdFx0XHRuYW1lOiBcIlByb2dyZXNzIEJhciBIb2xkZXJcIlxuXHRcdFx0cGFyZW50OiBAX3N0b3JpZXNDb250YWluZXJcblxuXHRcdCMgU2luZ2xlIGF1dGhvcidzIHN0b3JpZXMgaG9sZGVyIGNvbnN0cnVjdGlvbnNcblxuXHRcdEBfYXV0aG9yU3RvcnlIb2xkZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGggKiBAX251bWJlck9mVXBkYXRlc1xuXHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHRuYW1lOiBcIkF1dGhlcidzIFN0b3JpZXMgSG9sZGVyXCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cdFx0QF9hdXRob3JTdG9yeUhvbGRlci5wbGFjZUJlaGluZChAX3Byb2dyZXNzQmFySG9sZGVyKVxuXHRcdGF1dGhvclN0b3J5SG9sZGVyID0gQF9hdXRob3JTdG9yeUhvbGRlclxuXG5cdFx0cHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsV2lkdGggPSBAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoXG5cdFx0cHJvZ3Jlc3NCYXJIb2xkZXJGb3JMb29wID0gQF9wcm9ncmVzc0JhckhvbGRlclxuXHRcdHByb2dyZXNzQmFySG9sZGVySW5pdGlhbFNlY3Rpb25XaWR0aEZvckxvb3AgPSBAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFNlY3Rpb25XaWR0aFxuXG5cdFx0IyBHZW5lcmF0ZSBwcm9ncmVzcyBhbmQgZGV0ZXJtaW5lIGN1cnJlbnQgc3RvcnkgcG9zaXRpb24gZm9yIGF1dGhvclxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXIub25DaGFuZ2UgXCJ3aWR0aFwiLCAtPlxuXHRcdFx0YXV0aG9yUHJvZ3Jlc3MgPSBVdGlscy5tb2R1bGF0ZSh0aGlzLndpZHRoLCBbMCwgcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsV2lkdGhdLCBbMCwgMV0pXG5cdFx0XHRmb3IgbnVtYmVyIGluIFswLi4ubnVtYmVyT2ZVcGRhdGVzXVxuXHRcdFx0XHRpZiAoICggcHJvZ3Jlc3NCYXJIb2xkZXJGb3JMb29wLndpZHRoIDwgKCBwcm9ncmVzc0JhckhvbGRlckluaXRpYWxXaWR0aCAqICggbnVtYmVyICsgMSApICkgKSAmJiAoIHByb2dyZXNzQmFySG9sZGVyRm9yTG9vcC53aWR0aCA+ICggcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsU2VjdGlvbldpZHRoRm9yTG9vcCAqICggbnVtYmVyICkgKSApIClcblx0XHRcdFx0XHQjIGN1cnJlbnRTdG9yeU9mQXV0aG9yID0gbnVtYmVyICsgMVxuXHRcdFx0XHRcdGF1dGhvclN0b3J5SG9sZGVyLnggPSAoIC0gU2NyZWVuLndpZHRoICogbnVtYmVyIClcblxuXHRcdCMgR2VuZXJhdGUgc3RvcmllcyBhbmQgcHJvZ3Jlc3MgYmFyIHNlY3Rpb25zXG5cblx0XHRpZiAoIEBfbnVtYmVyT2ZVcGRhdGVzID4gMSApXG5cdFx0XHQjIEZvciBtb3JlIHRoYW4gb25lIHVwZGF0ZSBjcmVhdGUgc2VnbWVudHMgYW5kIHNwYWNlIGV2ZW5seVxuXHRcdFx0bnVtYmVyT2ZVcGRhdGVzID0gQF9udW1iZXJPZlVwZGF0ZXNcblx0XHRcdGZvciBudW1iZXIgaW4gWzAuLi5udW1iZXJPZlVwZGF0ZXNdXG5cdFx0XHRcdEBfc3RvcnkgPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFV0aWxzLnJhbmRvbUNvbG9yKClcblx0XHRcdFx0XHRpbWFnZTogQG9wdGlvbnMuc3Rvcmllc1tudW1iZXJdXG5cdFx0XHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0XHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdFx0XHRcdHg6IFNjcmVlbi53aWR0aCAqIG51bWJlclxuXHRcdFx0XHRcdHBhcmVudDogQF9hdXRob3JTdG9yeUhvbGRlclxuXHRcdFx0XHRAX3N0b3J5Lm5hbWUgPSBcIlN0b3J5IFwiICsgKCBudW1iZXIgKyAxIClcblx0XHRcdFx0QF9wcm9ncmVzc0JhclNlY3Rpb24gPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiXG5cdFx0XHRcdFx0aGVpZ2h0OiBAb3B0aW9ucy5wcm9ncmVzc0JhckhlaWdodFxuXHRcdFx0XHRcdHdpZHRoOiAoQF9wcm9ncmVzc0JhckhvbGRlci53aWR0aC1Ab3B0aW9ucy5wcm9ncmVzc0Jhckhvcml6b250YWxQYWRkaW5nKSAvICggQF9udW1iZXJPZlVwZGF0ZXMgKVxuXHRcdFx0XHRcdHg6IG51bWJlciAqICggKCBAX3Byb2dyZXNzQmFySG9sZGVyLndpZHRoIC8gQF9udW1iZXJPZlVwZGF0ZXMgKSArICggKCBAb3B0aW9ucy5wcm9ncmVzc0Jhckhvcml6b250YWxQYWRkaW5nIC8gMiApIC8gQF9udW1iZXJPZlVwZGF0ZXMgKSApXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiBAb3B0aW9ucy5wcm9ncmVzc0JhckhlaWdodFxuXHRcdFx0XHRcdHBhcmVudDogQF9wcm9ncmVzc0JhckhvbGRlclxuXHRcdFx0XHRAX3Byb2dyZXNzQmFyU2VjdGlvbi5uYW1lID0gXCJQcm9ncmVzcyBCYXIgU2VjdGlvbiBcIiArIG51bWJlclxuXHRcdGVsc2Vcblx0XHRcdCMgRm9yIG9uZSB1cGRhdGUgY3JlYXRlIGZ1bGwgd2lkdGggc2VnbWVudFxuXHRcdFx0QF9zdG9yeTEgPSBuZXcgTGF5ZXJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBVdGlscy5yYW5kb21Db2xvcigpXG5cdFx0XHRcdGltYWdlOiBAb3B0aW9ucy5zdG9yaWVzWzBdXG5cdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0cGFyZW50OiBAX2F1dGhvclN0b3J5SG9sZGVyXG5cdFx0XHRcdG5hbWU6IFwiU3RvcnlcIlxuXHRcdFx0QF9wcm9ncmVzc0JhclNlY3Rpb24xID0gbmV3IExheWVyXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmZmZmXCJcblx0XHRcdFx0aGVpZ2h0OiBAb3B0aW9ucy5wcm9ncmVzc0JhckhlaWdodFxuXHRcdFx0XHR3aWR0aDogQF9wcm9ncmVzc0JhckhvbGRlci53aWR0aFxuXHRcdFx0XHR4OiBBbGlnbi5sZWZ0XG5cdFx0XHRcdGJvcmRlclJhZGl1czogQG9wdGlvbnMucHJvZ3Jlc3NCYXJIZWlnaHRcblx0XHRcdFx0cGFyZW50OiBAX3Byb2dyZXNzQmFySG9sZGVyXG5cblx0XHQjIENyZWF0ZSBkdXBsaWNhdGUgcHJvZ3Jlc3MgYmFyIGFuZCBvcHRpb25hbCBncmFkaWVudCBmb3IgYmFja2dyb3VuZFxuXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckJHID0gQF9wcm9ncmVzc0JhckhvbGRlci5jb3B5KClcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQkcubmFtZSA9IFwiUHJvZ3Jlc3MgQmFyIEhvbGRlciBCYWNrZ3JvdW5kXCJcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQkcub3BhY2l0eSA9IDAuMjVcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQkcucGFyZW50ID0gQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHRpZiAoIEBvcHRpb25zLnByb2dyZXNzQmFyR3JhZGllbnQgPT0gdHJ1ZSApXG5cdFx0XHRAX3Byb2dyZXNzQmFyQmFja2dyb3VuZEdyYWRpZW50ID0gbmV3IExheWVyXG5cdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdFx0aGVpZ2h0OiAoIEBvcHRpb25zLnByb2dyZXNzQmFyVmVydGljYWxQYWRkaW5nICogMiApICsgKCBAb3B0aW9ucy5wcm9ncmVzc0JhckhlaWdodCArIDQgKVxuXHRcdFx0XHRncmFkaWVudDpcblx0XHRcdFx0XHRzdGFydDogXCJyZ2JhKDAsMCwwLDApXCJcblx0XHRcdFx0XHRlbmQ6IFwicmdiYSgwLDAsMCwwLjMpXCJcblx0XHRcdFx0bmFtZTogXCJQcm9ncmVzcyBCYXIgR3JhZGllbnRcIlxuXHRcdFx0XHRwYXJlbnQ6IEBfc3Rvcmllc0NvbnRhaW5lclxuXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckJHLmJyaW5nVG9Gcm9udCgpXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlci5icmluZ1RvRnJvbnQoKVxuXG5cdFx0IyBQcm9ncmVzcyBiYXIgY2xpcHBpbmcgZm9yIGFuaW1hdGlvblxuXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlci5jbGlwID0gdHJ1ZVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXIud2lkdGggPSAwXG5cblx0XHQjIFRvdWNoIGFjdGlvbnNcblxuXHRcdEBfbmV4dEhpdC5vblRvdWNoU3RhcnQgPT5cblx0XHRcdEBfc3RvcFN0b3JpZXNQbGF5YmFjaygpXG5cblx0XHRAX2JhY2tIaXQub25Ub3VjaFN0YXJ0ID0+XG5cdFx0XHRAX3N0b3BTdG9yaWVzUGxheWJhY2soKVxuXG5cdFx0QF9uZXh0SGl0LnByb2dyZXNzQmFySG9sZGVyID0gQF9wcm9ncmVzc0JhckhvbGRlclxuXHRcdEBfbmV4dEhpdC5wcm9ncmVzc0JhckhvbGRlckJHID0gQF9wcm9ncmVzc0JhckhvbGRlckJHXG5cdFx0QF9uZXh0SGl0Lm51bWJlck9mVXBkYXRlcyA9IEBfbnVtYmVyT2ZVcGRhdGVzXG5cblx0XHRAX2JhY2tIaXQucHJvZ3Jlc3NCYXJIb2xkZXIgPSBAX3Byb2dyZXNzQmFySG9sZGVyXG5cdFx0QF9iYWNrSGl0LnByb2dyZXNzQmFySG9sZGVyQkcgPSBAX3Byb2dyZXNzQmFySG9sZGVyQkdcblx0XHRAX2JhY2tIaXQubnVtYmVyT2ZVcGRhdGVzID0gQF9udW1iZXJPZlVwZGF0ZXNcblxuXHRcdEBfbmV4dEhpdC5vblRvdWNoRW5kID0+XG5cdFx0XHRpZiBsb25nUHJlc3MgPT0gZmFsc2Vcblx0XHRcdFx0QF9wcm9ncmVzc0JhckhvbGRlci53aWR0aCA9ICggQF9wcm9ncmVzc0JhckhvbGRlckJHLndpZHRoIC8gbnVtYmVyT2ZVcGRhdGVzICkgKiAoIGN1cnJlbnRTdG9yeU9mQXV0aG9yIClcblx0XHRcdFx0Y3VycmVudFN0b3J5T2ZBdXRob3IrK1xuXHRcdFx0XHRpZiBjdXJyZW50U3RvcnlPZkF1dGhvciA+PSBudW1iZXJPZlVwZGF0ZXNcblx0XHRcdFx0XHRjdXJyZW50U3RvcnlPZkF1dGhvciA9IGN1cnJlbnRTdG9yeU9mQXV0aG9yXG5cdFx0XHRcdEBfdG90YWxUaW1lID0gKCAoIG51bWJlck9mVXBkYXRlcyAtICggY3VycmVudFN0b3J5T2ZBdXRob3IgLSAxICkgKSAqIHRpbWVQZXJTdG9yeSApXG5cdFx0XHRcdEBfc3RhcnRTdG9yaWVzUGxheWJhY2soKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAX3N0YXJ0U3Rvcmllc1BsYXliYWNrKClcblx0XHRcdFx0bG9uZ1ByZXNzID0gZmFsc2VcblxuXHRcdEBfYmFja0hpdC5vblRvdWNoRW5kID0+XG5cdFx0XHRpZiBsb25nUHJlc3MgPT0gZmFsc2Vcblx0XHRcdFx0aWYgY3VycmVudFN0b3J5T2ZBdXRob3IgPiAxXG5cdFx0XHRcdFx0QF9wcm9ncmVzc0JhckhvbGRlci53aWR0aCA9ICggQF9wcm9ncmVzc0JhckhvbGRlckJHLndpZHRoIC8gbnVtYmVyT2ZVcGRhdGVzICkgKiAoIGN1cnJlbnRTdG9yeU9mQXV0aG9yIC0gMiApXG5cdFx0XHRcdGN1cnJlbnRTdG9yeU9mQXV0aG9yLS1cblx0XHRcdFx0aWYgY3VycmVudFN0b3J5T2ZBdXRob3IgPCAxXG5cdFx0XHRcdFx0Y3VycmVudFN0b3J5T2ZBdXRob3IgPSAxXG5cdFx0XHRcdEBfdG90YWxUaW1lID0gKCAoIG51bWJlck9mVXBkYXRlcyAtICggY3VycmVudFN0b3J5T2ZBdXRob3IgLSAxICkgKSAqIHRpbWVQZXJTdG9yeSApXG5cdFx0XHRcdEBfc3RhcnRTdG9yaWVzUGxheWJhY2soKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAX3N0YXJ0U3Rvcmllc1BsYXliYWNrKClcblx0XHRcdFx0bG9uZ1ByZXNzID0gZmFsc2VcblxuXHRcdEBfbmV4dEhpdC5vbkxvbmdQcmVzcyAtPlxuXHRcdFx0bG9uZ1ByZXNzID0gdHJ1ZVxuXG5cdFx0QF9iYWNrSGl0Lm9uTG9uZ1ByZXNzIC0+XG5cdFx0XHRsb25nUHJlc3MgPSB0cnVlXG5cblx0X3N0YXJ0U3Rvcmllc1BsYXliYWNrOiAtPlxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJBbmltYXRpb24gPSBAX3Byb2dyZXNzQmFySG9sZGVyLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdGN1cnZlOiBCZXppZXIubGluZWFyXG5cdFx0XHR0aW1lOiBAX3RvdGFsVGltZVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJBbmltYXRpb24ub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgKGFuaW1hdGlvbiwgbGF5ZXIpID0+XG5cdFx0XHRAX2VuZE9mVXBkYXRlc0V2ZW50LnggPSAxXG5cblx0X3N0b3BTdG9yaWVzUGxheWJhY2s6IC0+XG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckFuaW1hdGlvbi5zdG9wKClcblxuXHRfcmVzZXRTdG9yaWVzUGxheWJhY2s6IC0+XG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckFuaW1hdGlvbi5maW5pc2goKVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJBbmltYXRpb24ucmVzZXQoKSIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQ0FBOztBREFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUE7Ozs7QUE0Qk0sT0FBTyxDQUFDOzs7RUFDQSx3QkFBQyxRQUFEO0FBRVosUUFBQTtJQUZhLElBQUMsQ0FBQSw2QkFBRCxXQUFTOztJQUV0QixPQUFBLEdBQVUsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxJQUFDLENBQUEsT0FBWixFQUNUO01BQUEsNEJBQUEsRUFBOEIsRUFBOUI7TUFDQSwwQkFBQSxFQUE0QixFQUQ1QjtNQUVBLGlCQUFBLEVBQW1CLENBRm5CO01BR0EsbUJBQUEsRUFBcUIsSUFIckI7TUFJQSxZQUFBLEVBQWMsQ0FKZDtNQUtBLE9BQUEsRUFBUyxDQUFDLEVBQUQsQ0FMVDtLQURTO0lBUVYsZ0RBQU0sSUFBQyxDQUFBLE9BQVA7SUFFQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDckMsSUFBQyxDQUFBLFVBQUQsR0FBZ0IsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxPQUFPLENBQUM7SUFFN0MsSUFBQyxDQUFBLFlBQUQsQ0FBQTtFQWZZOzsyQkFpQmIsWUFBQSxHQUFjLFNBQUE7QUFFYixRQUFBO0lBQUEsU0FBQSxHQUFZO0lBQ1osb0JBQUEsR0FBdUI7SUFDdkIsWUFBQSxHQUFlLElBQUMsQ0FBQSxPQUFPLENBQUM7SUFDeEIsZUFBQSxHQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUluQyxJQUFDLENBQUEsaUJBQUQsR0FBeUIsSUFBQSxLQUFBLENBQ3hCO01BQUEsZUFBQSxFQUFpQixTQUFqQjtNQUNBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FEZDtNQUVBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFGZjtNQUdBLElBQUEsRUFBTSxtQkFITjtNQUlBLE1BQUEsRUFBUSxJQUpSO01BS0EsSUFBQSxFQUFNLElBTE47S0FEd0I7SUFVekIsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxLQUFBLENBQ2Y7TUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBQVAsR0FBZSxHQUF0QjtNQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFEZjtNQUVBLENBQUEsRUFBRyxLQUFLLENBQUMsS0FGVDtNQUdBLGVBQUEsRUFBaUIsZUFIakI7TUFJQSxJQUFBLEVBQU0sVUFKTjtNQUtBLE1BQUEsRUFBUSxJQUFDLENBQUEsaUJBTFQ7S0FEZTtJQVFoQixJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEtBQUEsQ0FDZjtNQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FBUCxHQUFlLENBQXRCO01BQ0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQURmO01BRUEsQ0FBQSxFQUFHLEtBQUssQ0FBQyxJQUZUO01BR0EsZUFBQSxFQUFpQixlQUhqQjtNQUlBLElBQUEsRUFBTSxVQUpOO01BS0EsTUFBQSxFQUFRLElBQUMsQ0FBQSxpQkFMVDtLQURlO0lBUWhCLElBQUMsQ0FBQSxrQkFBRCxHQUEwQixJQUFBLEtBQUEsQ0FDekI7TUFBQSxLQUFBLEVBQU8sQ0FBUDtNQUNBLE1BQUEsRUFBUSxDQURSO01BRUEsQ0FBQSxFQUFHLENBRkg7TUFHQSxDQUFBLEVBQUcsQ0FISDtNQUlBLGVBQUEsRUFBaUIsZUFKakI7TUFLQSxJQUFBLEVBQU0saUJBTE47TUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLGlCQU5UO0tBRHlCO0lBVzFCLElBQUMsQ0FBQSw4QkFBRCxHQUFvQyxNQUFNLENBQUMsS0FBVCxHQUFtQixDQUFFLElBQUMsQ0FBQSxPQUFPLENBQUMsNEJBQVQsR0FBd0MsQ0FBMUM7SUFDckQsSUFBQyxDQUFBLHFDQUFELEdBQTJDLElBQUMsQ0FBQSw4QkFBRCxHQUFrQyxJQUFDLENBQUE7SUFJOUUsSUFBQyxDQUFBLGtCQUFELEdBQTBCLElBQUEsS0FBQSxDQUN6QjtNQUFBLE1BQUEsRUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLGlCQUFqQjtNQUNBLEtBQUEsRUFBTyxJQUFDLENBQUEsOEJBRFI7TUFFQSxDQUFBLEVBQUcsS0FBSyxDQUFDLE1BRlQ7TUFHQSxDQUFBLEVBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQywwQkFIWjtNQUlBLGVBQUEsRUFBaUIsV0FKakI7TUFLQSxJQUFBLEVBQU0scUJBTE47TUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLGlCQU5UO0tBRHlCO0lBVzFCLElBQUMsQ0FBQSxrQkFBRCxHQUEwQixJQUFBLEtBQUEsQ0FDekI7TUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBQVAsR0FBZSxJQUFDLENBQUEsZ0JBQXZCO01BQ0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQURmO01BRUEsSUFBQSxFQUFNLHlCQUZOO01BR0EsTUFBQSxFQUFRLElBQUMsQ0FBQSxpQkFIVDtLQUR5QjtJQUsxQixJQUFDLENBQUEsa0JBQWtCLENBQUMsV0FBcEIsQ0FBZ0MsSUFBQyxDQUFBLGtCQUFqQztJQUNBLGlCQUFBLEdBQW9CLElBQUMsQ0FBQTtJQUVyQiw2QkFBQSxHQUFnQyxJQUFDLENBQUE7SUFDakMsd0JBQUEsR0FBMkIsSUFBQyxDQUFBO0lBQzVCLDJDQUFBLEdBQThDLElBQUMsQ0FBQTtJQUcvQyxJQUFDLENBQUEsa0JBQWtCLENBQUMsUUFBcEIsQ0FBNkIsT0FBN0IsRUFBc0MsU0FBQTtBQUNyQyxVQUFBO01BQUEsY0FBQSxHQUFpQixLQUFLLENBQUMsUUFBTixDQUFlLElBQUksQ0FBQyxLQUFwQixFQUEyQixDQUFDLENBQUQsRUFBSSw2QkFBSixDQUEzQixFQUErRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9EO0FBQ2pCO1dBQWMsa0dBQWQ7UUFDQyxJQUFLLENBQUUsd0JBQXdCLENBQUMsS0FBekIsR0FBaUMsQ0FBRSw2QkFBQSxHQUFnQyxDQUFFLE1BQUEsR0FBUyxDQUFYLENBQWxDLENBQW5DLENBQUEsSUFBMkYsQ0FBRSx3QkFBd0IsQ0FBQyxLQUF6QixHQUFpQyxDQUFFLDJDQUFBLEdBQWdELE1BQWxELENBQW5DLENBQWhHO3VCQUVDLGlCQUFpQixDQUFDLENBQWxCLEdBQXdCLENBQUUsTUFBTSxDQUFDLEtBQVQsR0FBaUIsUUFGMUM7U0FBQSxNQUFBOytCQUFBOztBQUREOztJQUZxQyxDQUF0QztJQVNBLElBQUssSUFBQyxDQUFBLGdCQUFELEdBQW9CLENBQXpCO01BRUMsZUFBQSxHQUFrQixJQUFDLENBQUE7QUFDbkIsV0FBYyxrR0FBZDtRQUNDLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxLQUFBLENBQ2I7VUFBQSxlQUFBLEVBQWlCLEtBQUssQ0FBQyxXQUFOLENBQUEsQ0FBakI7VUFDQSxLQUFBLEVBQU8sSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFRLENBQUEsTUFBQSxDQUR4QjtVQUVBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FGZDtVQUdBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFIZjtVQUlBLENBQUEsRUFBRyxNQUFNLENBQUMsS0FBUCxHQUFlLE1BSmxCO1VBS0EsTUFBQSxFQUFRLElBQUMsQ0FBQSxrQkFMVDtTQURhO1FBT2QsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWUsUUFBQSxHQUFXLENBQUUsTUFBQSxHQUFTLENBQVg7UUFDMUIsSUFBQyxDQUFBLG1CQUFELEdBQTJCLElBQUEsS0FBQSxDQUMxQjtVQUFBLGVBQUEsRUFBaUIsU0FBakI7VUFDQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxpQkFEakI7VUFFQSxLQUFBLEVBQU8sQ0FBQyxJQUFDLENBQUEsa0JBQWtCLENBQUMsS0FBcEIsR0FBMEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyw0QkFBcEMsQ0FBQSxHQUFzRSxJQUFDLENBQUEsZ0JBRjlFO1VBR0EsQ0FBQSxFQUFHLE1BQUEsR0FBUyxDQUFFLENBQUUsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEtBQXBCLEdBQTRCLElBQUMsQ0FBQSxnQkFBL0IsQ0FBQSxHQUFvRCxDQUFFLENBQUUsSUFBQyxDQUFBLE9BQU8sQ0FBQyw0QkFBVCxHQUF3QyxDQUExQyxDQUFBLEdBQWdELElBQUMsQ0FBQSxnQkFBbkQsQ0FBdEQsQ0FIWjtVQUlBLFlBQUEsRUFBYyxJQUFDLENBQUEsT0FBTyxDQUFDLGlCQUp2QjtVQUtBLE1BQUEsRUFBUSxJQUFDLENBQUEsa0JBTFQ7U0FEMEI7UUFPM0IsSUFBQyxDQUFBLG1CQUFtQixDQUFDLElBQXJCLEdBQTRCLHVCQUFBLEdBQTBCO0FBaEJ2RCxPQUhEO0tBQUEsTUFBQTtNQXNCQyxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsS0FBQSxDQUNkO1FBQUEsZUFBQSxFQUFpQixLQUFLLENBQUMsV0FBTixDQUFBLENBQWpCO1FBQ0EsS0FBQSxFQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FEeEI7UUFFQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBRmQ7UUFHQSxNQUFBLEVBQVEsTUFBTSxDQUFDLE1BSGY7UUFJQSxDQUFBLEVBQUcsQ0FKSDtRQUtBLE1BQUEsRUFBUSxJQUFDLENBQUEsa0JBTFQ7UUFNQSxJQUFBLEVBQU0sT0FOTjtPQURjO01BUWYsSUFBQyxDQUFBLG9CQUFELEdBQTRCLElBQUEsS0FBQSxDQUMzQjtRQUFBLGVBQUEsRUFBaUIsU0FBakI7UUFDQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxpQkFEakI7UUFFQSxLQUFBLEVBQU8sSUFBQyxDQUFBLGtCQUFrQixDQUFDLEtBRjNCO1FBR0EsQ0FBQSxFQUFHLEtBQUssQ0FBQyxJQUhUO1FBSUEsWUFBQSxFQUFjLElBQUMsQ0FBQSxPQUFPLENBQUMsaUJBSnZCO1FBS0EsTUFBQSxFQUFRLElBQUMsQ0FBQSxrQkFMVDtPQUQyQixFQTlCN0I7O0lBd0NBLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFDLENBQUEsa0JBQWtCLENBQUMsSUFBcEIsQ0FBQTtJQUN4QixJQUFDLENBQUEsb0JBQW9CLENBQUMsSUFBdEIsR0FBNkI7SUFDN0IsSUFBQyxDQUFBLG9CQUFvQixDQUFDLE9BQXRCLEdBQWdDO0lBQ2hDLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxNQUF0QixHQUErQixJQUFDLENBQUE7SUFFaEMsSUFBSyxJQUFDLENBQUEsT0FBTyxDQUFDLG1CQUFULEtBQWdDLElBQXJDO01BQ0MsSUFBQyxDQUFBLDhCQUFELEdBQXNDLElBQUEsS0FBQSxDQUNyQztRQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FBZDtRQUNBLE1BQUEsRUFBUSxDQUFFLElBQUMsQ0FBQSxPQUFPLENBQUMsMEJBQVQsR0FBc0MsQ0FBeEMsQ0FBQSxHQUE4QyxDQUFFLElBQUMsQ0FBQSxPQUFPLENBQUMsaUJBQVQsR0FBNkIsQ0FBL0IsQ0FEdEQ7UUFFQSxRQUFBLEVBQ0M7VUFBQSxLQUFBLEVBQU8sZUFBUDtVQUNBLEdBQUEsRUFBSyxpQkFETDtTQUhEO1FBS0EsSUFBQSxFQUFNLHVCQUxOO1FBTUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxpQkFOVDtPQURxQyxFQUR2Qzs7SUFVQSxJQUFDLENBQUEsb0JBQW9CLENBQUMsWUFBdEIsQ0FBQTtJQUNBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxZQUFwQixDQUFBO0lBSUEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLElBQXBCLEdBQTJCO0lBQzNCLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxLQUFwQixHQUE0QjtJQUk1QixJQUFDLENBQUEsUUFBUSxDQUFDLFlBQVYsQ0FBdUIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO2VBQ3RCLEtBQUMsQ0FBQSxvQkFBRCxDQUFBO01BRHNCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QjtJQUdBLElBQUMsQ0FBQSxRQUFRLENBQUMsWUFBVixDQUF1QixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7ZUFDdEIsS0FBQyxDQUFBLG9CQUFELENBQUE7TUFEc0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO0lBR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxpQkFBVixHQUE4QixJQUFDLENBQUE7SUFDL0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxtQkFBVixHQUFnQyxJQUFDLENBQUE7SUFDakMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxlQUFWLEdBQTRCLElBQUMsQ0FBQTtJQUU3QixJQUFDLENBQUEsUUFBUSxDQUFDLGlCQUFWLEdBQThCLElBQUMsQ0FBQTtJQUMvQixJQUFDLENBQUEsUUFBUSxDQUFDLG1CQUFWLEdBQWdDLElBQUMsQ0FBQTtJQUNqQyxJQUFDLENBQUEsUUFBUSxDQUFDLGVBQVYsR0FBNEIsSUFBQyxDQUFBO0lBRTdCLElBQUMsQ0FBQSxRQUFRLENBQUMsVUFBVixDQUFxQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDcEIsSUFBRyxTQUFBLEtBQWEsS0FBaEI7VUFDQyxLQUFDLENBQUEsa0JBQWtCLENBQUMsS0FBcEIsR0FBNEIsQ0FBRSxLQUFDLENBQUEsb0JBQW9CLENBQUMsS0FBdEIsR0FBOEIsZUFBaEMsQ0FBQSxHQUFzRDtVQUNsRixvQkFBQTtVQUNBLElBQUcsb0JBQUEsSUFBd0IsZUFBM0I7WUFDQyxvQkFBQSxHQUF1QixxQkFEeEI7O1VBRUEsS0FBQyxDQUFBLFVBQUQsR0FBZ0IsQ0FBRSxlQUFBLEdBQWtCLENBQUUsb0JBQUEsR0FBdUIsQ0FBekIsQ0FBcEIsQ0FBQSxHQUFxRDtpQkFDckUsS0FBQyxDQUFBLHFCQUFELENBQUEsRUFORDtTQUFBLE1BQUE7VUFRQyxLQUFDLENBQUEscUJBQUQsQ0FBQTtpQkFDQSxTQUFBLEdBQVksTUFUYjs7TUFEb0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCO0lBWUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQXFCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtRQUNwQixJQUFHLFNBQUEsS0FBYSxLQUFoQjtVQUNDLElBQUcsb0JBQUEsR0FBdUIsQ0FBMUI7WUFDQyxLQUFDLENBQUEsa0JBQWtCLENBQUMsS0FBcEIsR0FBNEIsQ0FBRSxLQUFDLENBQUEsb0JBQW9CLENBQUMsS0FBdEIsR0FBOEIsZUFBaEMsQ0FBQSxHQUFvRCxDQUFFLG9CQUFBLEdBQXVCLENBQXpCLEVBRGpGOztVQUVBLG9CQUFBO1VBQ0EsSUFBRyxvQkFBQSxHQUF1QixDQUExQjtZQUNDLG9CQUFBLEdBQXVCLEVBRHhCOztVQUVBLEtBQUMsQ0FBQSxVQUFELEdBQWdCLENBQUUsZUFBQSxHQUFrQixDQUFFLG9CQUFBLEdBQXVCLENBQXpCLENBQXBCLENBQUEsR0FBcUQ7aUJBQ3JFLEtBQUMsQ0FBQSxxQkFBRCxDQUFBLEVBUEQ7U0FBQSxNQUFBO1VBU0MsS0FBQyxDQUFBLHFCQUFELENBQUE7aUJBQ0EsU0FBQSxHQUFZLE1BVmI7O01BRG9CO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjtJQWFBLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFzQixTQUFBO2FBQ3JCLFNBQUEsR0FBWTtJQURTLENBQXRCO1dBR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLENBQXNCLFNBQUE7YUFDckIsU0FBQSxHQUFZO0lBRFMsQ0FBdEI7RUEvTGE7OzJCQWtNZCxxQkFBQSxHQUF1QixTQUFBO0lBQ3RCLElBQUMsQ0FBQSwyQkFBRCxHQUErQixJQUFDLENBQUEsa0JBQWtCLENBQUMsT0FBcEIsQ0FDOUI7TUFBQSxVQUFBLEVBQ0M7UUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBQWQ7T0FERDtNQUVBLEtBQUEsRUFBTyxNQUFNLENBQUMsTUFGZDtNQUdBLElBQUEsRUFBTSxJQUFDLENBQUEsVUFIUDtLQUQ4QjtXQUsvQixJQUFDLENBQUEsMkJBQTJCLENBQUMsRUFBN0IsQ0FBZ0MsTUFBTSxDQUFDLFlBQXZDLEVBQXFELENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxTQUFELEVBQVksS0FBWjtlQUNwRCxLQUFDLENBQUEsa0JBQWtCLENBQUMsQ0FBcEIsR0FBd0I7TUFENEI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJEO0VBTnNCOzsyQkFTdkIsb0JBQUEsR0FBc0IsU0FBQTtXQUNyQixJQUFDLENBQUEsMkJBQTJCLENBQUMsSUFBN0IsQ0FBQTtFQURxQjs7MkJBR3RCLHFCQUFBLEdBQXVCLFNBQUE7SUFDdEIsSUFBQyxDQUFBLDJCQUEyQixDQUFDLE1BQTdCLENBQUE7V0FDQSxJQUFDLENBQUEsMkJBQTJCLENBQUMsS0FBN0IsQ0FBQTtFQUZzQjs7OztHQWhPYSJ9
