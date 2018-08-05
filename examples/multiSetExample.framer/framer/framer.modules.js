require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"StoryComponent":[function(require,module,exports){

/*
	 * Story Component

	 * Example
	{StoryComponent} = require "StoryComponent"
	exampleSet = new StoryComponent
		progressBarHorizontalPadding: 12
		progressBarVerticalPadding: 12
		progressBarHeight: 4
		progressBarGradient: true
		timePerStory: 3
		stories: [ "images/1.png", "images/2.png", "images/3.png" ]
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
          currentStoryOfAuthor = number + 1;
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
        image: this.options.stories[number],
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
    this._progressBarHolderAnimation.reset();
    return this._authorStoryHolder.x = 0;
  };

  return StoryComponent;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2NoYXJsaWVkZWV0cy9Ecm9wYm94IChQZXJzb25hbCkvRGVzaWduL0ZyYW1lci9TdG9yeUNvbXBvbmVudC9TdG9yeUNvbXBvbmVudC9leGFtcGxlcy9tdWx0aVNldEV4YW1wbGUuZnJhbWVyL21vZHVsZXMvU3RvcnlDb21wb25lbnQuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblx0IyBTdG9yeSBDb21wb25lbnRcblxuXHQjIEV4YW1wbGVcblx0e1N0b3J5Q29tcG9uZW50fSA9IHJlcXVpcmUgXCJTdG9yeUNvbXBvbmVudFwiXG5cdGV4YW1wbGVTZXQgPSBuZXcgU3RvcnlDb21wb25lbnRcblx0XHRwcm9ncmVzc0Jhckhvcml6b250YWxQYWRkaW5nOiAxMlxuXHRcdHByb2dyZXNzQmFyVmVydGljYWxQYWRkaW5nOiAxMlxuXHRcdHByb2dyZXNzQmFySGVpZ2h0OiA0XG5cdFx0cHJvZ3Jlc3NCYXJHcmFkaWVudDogdHJ1ZVxuXHRcdHRpbWVQZXJTdG9yeTogM1xuXHRcdHN0b3JpZXM6IFsgXCJpbWFnZXMvMS5wbmdcIiwgXCJpbWFnZXMvMi5wbmdcIiwgXCJpbWFnZXMvMy5wbmdcIiBdXG4jIyNcblxuY2xhc3MgZXhwb3J0cy5TdG9yeUNvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHRvcHRpb25zID0gXy5kZWZhdWx0cyBAb3B0aW9ucyxcblx0XHRcdHByb2dyZXNzQmFySG9yaXpvbnRhbFBhZGRpbmc6IDEyXG5cdFx0XHRwcm9ncmVzc0JhclZlcnRpY2FsUGFkZGluZzogMTJcblx0XHRcdHByb2dyZXNzQmFySGVpZ2h0OiA0XG5cdFx0XHRwcm9ncmVzc0JhckdyYWRpZW50OiB0cnVlXG5cdFx0XHR0aW1lUGVyU3Rvcnk6IDNcblx0XHRcdHN0b3JpZXM6IFtcIlwiXVxuXG5cdFx0c3VwZXIgQG9wdGlvbnNcblxuXHRcdEBfbnVtYmVyT2ZVcGRhdGVzID0gQG9wdGlvbnMuc3Rvcmllcy5sZW5ndGhcblx0XHRAX3RvdGFsVGltZSA9ICggQF9udW1iZXJPZlVwZGF0ZXMgKiBAb3B0aW9ucy50aW1lUGVyU3RvcnkgKVxuXG5cdFx0QF9zZXR1cExheW91dCgpXG5cblx0X3NldHVwTGF5b3V0OiA9PlxuXG5cdFx0bG9uZ1ByZXNzID0gZmFsc2Vcblx0XHRjdXJyZW50U3RvcnlPZkF1dGhvciA9IDFcblx0XHR0aW1lUGVyU3RvcnkgPSBAb3B0aW9ucy50aW1lUGVyU3Rvcnlcblx0XHRudW1iZXJPZlVwZGF0ZXMgPSBAb3B0aW9ucy5zdG9yaWVzLmxlbmd0aFxuXG5cdFx0IyBMYXlvdXQgY29uc3RydWN0aW9uXG5cblx0XHRAX3N0b3JpZXNDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjkyOTI5XCJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdFx0bmFtZTogXCJTdG9yaWVzIENvbnRhaW5lclwiXG5cdFx0XHRwYXJlbnQ6IHRoaXNcblx0XHRcdGNsaXA6IHRydWVcblxuXHRcdCMgSGl0IGFyZWFzIGNvbnN0cnVjdGlvblxuXG5cdFx0QF9uZXh0SGl0ID0gbmV3IExheWVyXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoIC8gMS41XG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdHg6IEFsaWduLnJpZ2h0XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgwLDAsMCwwKVwiXG5cdFx0XHRuYW1lOiBcIk5leHQgaGl0XCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHRAX2JhY2tIaXQgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGggLyAzXG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdHg6IEFsaWduLmxlZnRcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDAsMCwwLDApXCJcblx0XHRcdG5hbWU6IFwiQmFjayBoaXRcIlxuXHRcdFx0cGFyZW50OiBAX3N0b3JpZXNDb250YWluZXJcblxuXHRcdEBfZW5kT2ZVcGRhdGVzRXZlbnQgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiAxXG5cdFx0XHRoZWlnaHQ6IDFcblx0XHRcdHg6IDBcblx0XHRcdHk6IDBcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDAsMCwwLDApXCJcblx0XHRcdG5hbWU6IFwiVmFyaWFibGUgSG9sZGVyXCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHQjIFdpZHRocyB2YWx1ZXMgZm9yIHByb2dyZXNzXG5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoID0gKCBTY3JlZW4ud2lkdGggKSAtICggQG9wdGlvbnMucHJvZ3Jlc3NCYXJIb3Jpem9udGFsUGFkZGluZyAqIDIgKVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsU2VjdGlvbldpZHRoID0gKCBAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoIC8gQF9udW1iZXJPZlVwZGF0ZXMgKVxuXG5cdFx0IyBQcm9ncmVzcyBiYXIgY29uc3RydWN0aW9uXG5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyID0gbmV3IExheWVyXG5cdFx0XHRoZWlnaHQ6IEBvcHRpb25zLnByb2dyZXNzQmFySGVpZ2h0XG5cdFx0XHR3aWR0aDogQF9wcm9ncmVzc0JhckhvbGRlckluaXRpYWxXaWR0aFxuXHRcdFx0eDogQWxpZ24uY2VudGVyXG5cdFx0XHR5OiBAb3B0aW9ucy5wcm9ncmVzc0JhclZlcnRpY2FsUGFkZGluZ1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiMwMGZmZmZmZlwiXG5cdFx0XHRuYW1lOiBcIlByb2dyZXNzIEJhciBIb2xkZXJcIlxuXHRcdFx0cGFyZW50OiBAX3N0b3JpZXNDb250YWluZXJcblxuXHRcdCMgU2luZ2xlIGF1dGhvcidzIHN0b3JpZXMgaG9sZGVyIGNvbnN0cnVjdGlvbnNcblxuXHRcdEBfYXV0aG9yU3RvcnlIb2xkZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGggKiBAX251bWJlck9mVXBkYXRlc1xuXHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHRuYW1lOiBcIkF1dGhlcidzIFN0b3JpZXMgSG9sZGVyXCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cdFx0QF9hdXRob3JTdG9yeUhvbGRlci5wbGFjZUJlaGluZChAX3Byb2dyZXNzQmFySG9sZGVyKVxuXHRcdGF1dGhvclN0b3J5SG9sZGVyID0gQF9hdXRob3JTdG9yeUhvbGRlclxuXG5cdFx0cHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsV2lkdGggPSBAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoXG5cdFx0cHJvZ3Jlc3NCYXJIb2xkZXJGb3JMb29wID0gQF9wcm9ncmVzc0JhckhvbGRlclxuXHRcdHByb2dyZXNzQmFySG9sZGVySW5pdGlhbFNlY3Rpb25XaWR0aEZvckxvb3AgPSBAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFNlY3Rpb25XaWR0aFxuXG5cdFx0IyBHZW5lcmF0ZSBwcm9ncmVzcyBhbmQgZGV0ZXJtaW5lIGN1cnJlbnQgc3RvcnkgcG9zaXRpb24gZm9yIGF1dGhvclxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXIub25DaGFuZ2UgXCJ3aWR0aFwiLCAtPlxuXHRcdFx0YXV0aG9yUHJvZ3Jlc3MgPSBVdGlscy5tb2R1bGF0ZSh0aGlzLndpZHRoLCBbMCwgcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsV2lkdGhdLCBbMCwgMV0pXG5cdFx0XHRmb3IgbnVtYmVyIGluIFswLi4ubnVtYmVyT2ZVcGRhdGVzXVxuXHRcdFx0XHRpZiAoICggcHJvZ3Jlc3NCYXJIb2xkZXJGb3JMb29wLndpZHRoIDwgKCBwcm9ncmVzc0JhckhvbGRlckluaXRpYWxXaWR0aCAqICggbnVtYmVyICsgMSApICkgKSAmJiAoIHByb2dyZXNzQmFySG9sZGVyRm9yTG9vcC53aWR0aCA+ICggcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsU2VjdGlvbldpZHRoRm9yTG9vcCAqICggbnVtYmVyICkgKSApIClcblx0XHRcdFx0XHRjdXJyZW50U3RvcnlPZkF1dGhvciA9IG51bWJlciArIDFcblx0XHRcdFx0XHRhdXRob3JTdG9yeUhvbGRlci54ID0gKCAtIFNjcmVlbi53aWR0aCAqIG51bWJlciApXG5cblx0XHQjIEdlbmVyYXRlIHN0b3JpZXMgYW5kIHByb2dyZXNzIGJhciBzZWN0aW9uc1xuXG5cdFx0aWYgKCBAX251bWJlck9mVXBkYXRlcyA+IDEgKVxuXHRcdFx0IyBGb3IgbW9yZSB0aGFuIG9uZSB1cGRhdGUgY3JlYXRlIHNlZ21lbnRzIGFuZCBzcGFjZSBldmVubHlcblx0XHRcdG51bWJlck9mVXBkYXRlcyA9IEBfbnVtYmVyT2ZVcGRhdGVzXG5cdFx0XHRmb3IgbnVtYmVyIGluIFswLi4ubnVtYmVyT2ZVcGRhdGVzXVxuXHRcdFx0XHRAX3N0b3J5ID0gbmV3IExheWVyXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBVdGlscy5yYW5kb21Db2xvcigpXG5cdFx0XHRcdFx0aW1hZ2U6IEBvcHRpb25zLnN0b3JpZXNbbnVtYmVyXVxuXHRcdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdFx0XHR4OiBTY3JlZW4ud2lkdGggKiBudW1iZXJcblx0XHRcdFx0XHRwYXJlbnQ6IEBfYXV0aG9yU3RvcnlIb2xkZXJcblx0XHRcdFx0QF9zdG9yeS5uYW1lID0gXCJTdG9yeSBcIiArICggbnVtYmVyICsgMSApXG5cdFx0XHRcdEBfcHJvZ3Jlc3NCYXJTZWN0aW9uID0gbmV3IExheWVyXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZmZmZcIlxuXHRcdFx0XHRcdGhlaWdodDogQG9wdGlvbnMucHJvZ3Jlc3NCYXJIZWlnaHRcblx0XHRcdFx0XHR3aWR0aDogKEBfcHJvZ3Jlc3NCYXJIb2xkZXIud2lkdGgtQG9wdGlvbnMucHJvZ3Jlc3NCYXJIb3Jpem9udGFsUGFkZGluZykgLyAoIEBfbnVtYmVyT2ZVcGRhdGVzIClcblx0XHRcdFx0XHR4OiBudW1iZXIgKiAoICggQF9wcm9ncmVzc0JhckhvbGRlci53aWR0aCAvIEBfbnVtYmVyT2ZVcGRhdGVzICkgKyAoICggQG9wdGlvbnMucHJvZ3Jlc3NCYXJIb3Jpem9udGFsUGFkZGluZyAvIDIgKSAvIEBfbnVtYmVyT2ZVcGRhdGVzICkgKVxuXHRcdFx0XHRcdGJvcmRlclJhZGl1czogQG9wdGlvbnMucHJvZ3Jlc3NCYXJIZWlnaHRcblx0XHRcdFx0XHRwYXJlbnQ6IEBfcHJvZ3Jlc3NCYXJIb2xkZXJcblx0XHRcdFx0QF9wcm9ncmVzc0JhclNlY3Rpb24ubmFtZSA9IFwiUHJvZ3Jlc3MgQmFyIFNlY3Rpb24gXCIgKyBudW1iZXJcblx0XHRlbHNlXG5cdFx0XHQjIEZvciBvbmUgdXBkYXRlIGNyZWF0ZSBmdWxsIHdpZHRoIHNlZ21lbnRcblx0XHRcdEBfc3RvcnkxID0gbmV3IExheWVyXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogVXRpbHMucmFuZG9tQ29sb3IoKVxuXHRcdFx0XHRpbWFnZTogQG9wdGlvbnMuc3Rvcmllc1tudW1iZXJdXG5cdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0cGFyZW50OiBAX2F1dGhvclN0b3J5SG9sZGVyXG5cdFx0XHRcdG5hbWU6IFwiU3RvcnlcIlxuXHRcdFx0QF9wcm9ncmVzc0JhclNlY3Rpb24xID0gbmV3IExheWVyXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmZmZmXCJcblx0XHRcdFx0aGVpZ2h0OiBAb3B0aW9ucy5wcm9ncmVzc0JhckhlaWdodFxuXHRcdFx0XHR3aWR0aDogQF9wcm9ncmVzc0JhckhvbGRlci53aWR0aFxuXHRcdFx0XHR4OiBBbGlnbi5sZWZ0XG5cdFx0XHRcdGJvcmRlclJhZGl1czogQG9wdGlvbnMucHJvZ3Jlc3NCYXJIZWlnaHRcblx0XHRcdFx0cGFyZW50OiBAX3Byb2dyZXNzQmFySG9sZGVyXG5cblx0XHQjIENyZWF0ZSBkdXBsaWNhdGUgcHJvZ3Jlc3MgYmFyIGFuZCBvcHRpb25hbCBncmFkaWVudCBmb3IgYmFja2dyb3VuZFxuXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckJHID0gQF9wcm9ncmVzc0JhckhvbGRlci5jb3B5KClcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQkcubmFtZSA9IFwiUHJvZ3Jlc3MgQmFyIEhvbGRlciBCYWNrZ3JvdW5kXCJcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQkcub3BhY2l0eSA9IDAuMjVcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQkcucGFyZW50ID0gQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHRpZiAoIEBvcHRpb25zLnByb2dyZXNzQmFyR3JhZGllbnQgPT0gdHJ1ZSApXG5cdFx0XHRAX3Byb2dyZXNzQmFyQmFja2dyb3VuZEdyYWRpZW50ID0gbmV3IExheWVyXG5cdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdFx0aGVpZ2h0OiAoIEBvcHRpb25zLnByb2dyZXNzQmFyVmVydGljYWxQYWRkaW5nICogMiApICsgKCBAb3B0aW9ucy5wcm9ncmVzc0JhckhlaWdodCArIDQgKVxuXHRcdFx0XHRncmFkaWVudDpcblx0XHRcdFx0XHRzdGFydDogXCJyZ2JhKDAsMCwwLDApXCJcblx0XHRcdFx0XHRlbmQ6IFwicmdiYSgwLDAsMCwwLjMpXCJcblx0XHRcdFx0bmFtZTogXCJQcm9ncmVzcyBCYXIgR3JhZGllbnRcIlxuXHRcdFx0XHRwYXJlbnQ6IEBfc3Rvcmllc0NvbnRhaW5lclxuXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckJHLmJyaW5nVG9Gcm9udCgpXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlci5icmluZ1RvRnJvbnQoKVxuXG5cdFx0IyBQcm9ncmVzcyBiYXIgY2xpcHBpbmcgZm9yIGFuaW1hdGlvblxuXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlci5jbGlwID0gdHJ1ZVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXIud2lkdGggPSAwXG5cblx0XHQjIFRvdWNoIGFjdGlvbnNcblxuXHRcdEBfbmV4dEhpdC5vblRvdWNoU3RhcnQgPT5cblx0XHRcdEBfc3RvcFN0b3JpZXNQbGF5YmFjaygpXG5cblx0XHRAX2JhY2tIaXQub25Ub3VjaFN0YXJ0ID0+XG5cdFx0XHRAX3N0b3BTdG9yaWVzUGxheWJhY2soKVxuXG5cdFx0QF9uZXh0SGl0LnByb2dyZXNzQmFySG9sZGVyID0gQF9wcm9ncmVzc0JhckhvbGRlclxuXHRcdEBfbmV4dEhpdC5wcm9ncmVzc0JhckhvbGRlckJHID0gQF9wcm9ncmVzc0JhckhvbGRlckJHXG5cdFx0QF9uZXh0SGl0Lm51bWJlck9mVXBkYXRlcyA9IEBfbnVtYmVyT2ZVcGRhdGVzXG5cblx0XHRAX2JhY2tIaXQucHJvZ3Jlc3NCYXJIb2xkZXIgPSBAX3Byb2dyZXNzQmFySG9sZGVyXG5cdFx0QF9iYWNrSGl0LnByb2dyZXNzQmFySG9sZGVyQkcgPSBAX3Byb2dyZXNzQmFySG9sZGVyQkdcblx0XHRAX2JhY2tIaXQubnVtYmVyT2ZVcGRhdGVzID0gQF9udW1iZXJPZlVwZGF0ZXNcblxuXHRcdEBfbmV4dEhpdC5vblRvdWNoRW5kID0+XG5cdFx0XHRpZiBsb25nUHJlc3MgPT0gZmFsc2Vcblx0XHRcdFx0QF9wcm9ncmVzc0JhckhvbGRlci53aWR0aCA9ICggQF9wcm9ncmVzc0JhckhvbGRlckJHLndpZHRoIC8gbnVtYmVyT2ZVcGRhdGVzICkgKiAoIGN1cnJlbnRTdG9yeU9mQXV0aG9yIClcblx0XHRcdFx0Y3VycmVudFN0b3J5T2ZBdXRob3IrK1xuXHRcdFx0XHRpZiBjdXJyZW50U3RvcnlPZkF1dGhvciA+PSBudW1iZXJPZlVwZGF0ZXNcblx0XHRcdFx0XHRjdXJyZW50U3RvcnlPZkF1dGhvciA9IGN1cnJlbnRTdG9yeU9mQXV0aG9yXG5cdFx0XHRcdEBfdG90YWxUaW1lID0gKCAoIG51bWJlck9mVXBkYXRlcyAtICggY3VycmVudFN0b3J5T2ZBdXRob3IgLSAxICkgKSAqIHRpbWVQZXJTdG9yeSApXG5cdFx0XHRcdEBfc3RhcnRTdG9yaWVzUGxheWJhY2soKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAX3N0YXJ0U3Rvcmllc1BsYXliYWNrKClcblx0XHRcdFx0bG9uZ1ByZXNzID0gZmFsc2VcblxuXHRcdEBfYmFja0hpdC5vblRvdWNoRW5kID0+XG5cdFx0XHRpZiBsb25nUHJlc3MgPT0gZmFsc2Vcblx0XHRcdFx0aWYgY3VycmVudFN0b3J5T2ZBdXRob3IgPiAxXG5cdFx0XHRcdFx0QF9wcm9ncmVzc0JhckhvbGRlci53aWR0aCA9ICggQF9wcm9ncmVzc0JhckhvbGRlckJHLndpZHRoIC8gbnVtYmVyT2ZVcGRhdGVzICkgKiAoIGN1cnJlbnRTdG9yeU9mQXV0aG9yIC0gMiApXG5cdFx0XHRcdGN1cnJlbnRTdG9yeU9mQXV0aG9yLS1cblx0XHRcdFx0aWYgY3VycmVudFN0b3J5T2ZBdXRob3IgPCAxXG5cdFx0XHRcdFx0Y3VycmVudFN0b3J5T2ZBdXRob3IgPSAxXG5cdFx0XHRcdEBfdG90YWxUaW1lID0gKCAoIG51bWJlck9mVXBkYXRlcyAtICggY3VycmVudFN0b3J5T2ZBdXRob3IgLSAxICkgKSAqIHRpbWVQZXJTdG9yeSApXG5cdFx0XHRcdEBfc3RhcnRTdG9yaWVzUGxheWJhY2soKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAX3N0YXJ0U3Rvcmllc1BsYXliYWNrKClcblx0XHRcdFx0bG9uZ1ByZXNzID0gZmFsc2VcblxuXHRcdEBfbmV4dEhpdC5vbkxvbmdQcmVzcyAtPlxuXHRcdFx0bG9uZ1ByZXNzID0gdHJ1ZVxuXG5cdFx0QF9iYWNrSGl0Lm9uTG9uZ1ByZXNzIC0+XG5cdFx0XHRsb25nUHJlc3MgPSB0cnVlXG5cblx0X3N0YXJ0U3Rvcmllc1BsYXliYWNrOiAtPlxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJBbmltYXRpb24gPSBAX3Byb2dyZXNzQmFySG9sZGVyLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdGN1cnZlOiBCZXppZXIubGluZWFyXG5cdFx0XHR0aW1lOiBAX3RvdGFsVGltZVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJBbmltYXRpb24ub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgKGFuaW1hdGlvbiwgbGF5ZXIpID0+XG5cdFx0XHRAX2VuZE9mVXBkYXRlc0V2ZW50LnggPSAxXG5cblx0X3N0b3BTdG9yaWVzUGxheWJhY2s6IC0+XG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckFuaW1hdGlvbi5zdG9wKClcblxuXHRfcmVzZXRTdG9yaWVzUGxheWJhY2s6IC0+XG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckFuaW1hdGlvbi5maW5pc2goKVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJBbmltYXRpb24ucmVzZXQoKVxuXHRcdEBfYXV0aG9yU3RvcnlIb2xkZXIueCA9IDAiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUNBQTs7QURBQTs7Ozs7Ozs7Ozs7OztBQUFBLElBQUE7Ozs7QUFjTSxPQUFPLENBQUM7OztFQUNBLHdCQUFDLFFBQUQ7QUFFWixRQUFBO0lBRmEsSUFBQyxDQUFBLDZCQUFELFdBQVM7O0lBRXRCLE9BQUEsR0FBVSxDQUFDLENBQUMsUUFBRixDQUFXLElBQUMsQ0FBQSxPQUFaLEVBQ1Q7TUFBQSw0QkFBQSxFQUE4QixFQUE5QjtNQUNBLDBCQUFBLEVBQTRCLEVBRDVCO01BRUEsaUJBQUEsRUFBbUIsQ0FGbkI7TUFHQSxtQkFBQSxFQUFxQixJQUhyQjtNQUlBLFlBQUEsRUFBYyxDQUpkO01BS0EsT0FBQSxFQUFTLENBQUMsRUFBRCxDQUxUO0tBRFM7SUFRVixnREFBTSxJQUFDLENBQUEsT0FBUDtJQUVBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNyQyxJQUFDLENBQUEsVUFBRCxHQUFnQixJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLE9BQU8sQ0FBQztJQUU3QyxJQUFDLENBQUEsWUFBRCxDQUFBO0VBZlk7OzJCQWlCYixZQUFBLEdBQWMsU0FBQTtBQUViLFFBQUE7SUFBQSxTQUFBLEdBQVk7SUFDWixvQkFBQSxHQUF1QjtJQUN2QixZQUFBLEdBQWUsSUFBQyxDQUFBLE9BQU8sQ0FBQztJQUN4QixlQUFBLEdBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDO0lBSW5DLElBQUMsQ0FBQSxpQkFBRCxHQUF5QixJQUFBLEtBQUEsQ0FDeEI7TUFBQSxlQUFBLEVBQWlCLFNBQWpCO01BQ0EsS0FBQSxFQUFPLE1BQU0sQ0FBQyxLQURkO01BRUEsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQUZmO01BR0EsSUFBQSxFQUFNLG1CQUhOO01BSUEsTUFBQSxFQUFRLElBSlI7TUFL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
