const themeColorLessText = `
.mu-primary-color {
  background-color: @primaryColor;
}

.mu-secondary-color {
  background-color: @secondaryColor;
}

.mu-success-color {
  background-color: @successColor;
}

.mu-warning-color {
  background-color: @warningColor;
}

.mu-info-color {
  background-color: @infoColor;
}

.mu-error-color {
  background-color: @errorColor;
}

.mu-inverse {
  color: @alternateTextColor;
}

.mu-primary-text-color {
  color: @primaryColor;
}

.mu-secondary-text-color {
  color: @secondaryColor;
}

.mu-success-text-color {
  color: @successColor;
}

.mu-warning-text-color {
  color: @warningColor;
}

.mu-info-text-color {
  color: @infoColor;
}

.mu-error-text-color {
  color: @errorColor;
}
`

const appColorLessText = `
body {
  background-color: @backgroundColor;
}

a {
  color: @secondaryColor;
}

// class for mixin
.primary-theme-bg-color {
  background-color: @primaryColor !important;

  > * {
    color: @alternateTextColor;
  }
}

.secondary-theme-bg-color {
  background-color: @secondaryColor;
}


.default-theme-bg-color {
  background-color: @backgroundColor;
}

.primary-theme-text-color {
  color: @primaryColor;
}

.secondary-theme-text-color {
  color: @secondaryColor;
}

.primary-read-text-color {
  color: @textColor;
}

.secondary-read-text-color {
  color: @secondaryTextColor;
}

.placeholder-read-text-color {
  color: @trackColor;
}

.base-theme-bg-color {
  background-color: @backgroundColor !important;
}

.dialog-theme-bg-color {
  background-color: @dialogBackgroundColor;
}

// class for certain component
.status-card {
  .operate-btn-group {
    .count {
      color: @textColor;
    }
  }
}

.circle-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  -webkit-transition: background .3s;
  -moz-transition: background .3s;
  -ms-transition: background .3s;
  -o-transition: background .3s;
  transition: background .3s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  margin: 0 8px;
  font-size: 15px;

  background-color: @backgroundColor;
  color: @textColor;

  &.disabled {
    cursor: not-allowed !important;

    &:hover {
      box-shadow: none;
    }
  }

  &:hover {
    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.26);
  }

  &.primary-theme-bg-color {
    background-color: @primaryColor;
  }

  &.unset-display {
    display: unset;
  }

  &.hover:before {
    background-color: unset;
  }
}

.header-svg-fill {
  fill: @secondaryTextColor;
}

.auto-size-text-area {
  width: 100%;
  font-size: 15px;
  line-height: 18px;
  outline: none;
  border: none;
  padding: 0;
  resize: none;
  background-color: @dialogBackgroundColor;
  color: @textColor;
}

.cuckoo-header-container {
  .mu-text-field-input {
    color: #fff;
  }
}

.delete-hash-btn {
  color: @textColor !important;
}

.media-area {
  height: 212px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;

  &.single-media-area {
    .media-item {
      margin: 0;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  .media-item {
    margin-right: 8px;
    position: relative;
    display: inline-block;
    height: 100%;

    img {
      width: auto;
      height: 100%;
      display: block;
    }
  }
}

.media-area {
  .media-item {

  }
}

// for overwrite muse-ui style
.mu-dialog {
  background-color: @dialogBackgroundColor;

  .mu-dialog-body {
    height: 100%;
    color: @textColor;
  }
}

.mu-card {
  color: @textColor;
  background-color: @dialogBackgroundColor;
  -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  -moz-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);

  .mu-card-text {
    color: @textColor;
  }

  .mu-card-header-title {

    .mu-card-title {
      color: @textColor;
    }

    .mu-card-sub-title {
      color: @secondaryTextColor;
    }

  }
}

.mu-input {
  color: @secondaryTextColor;

  .mu-select-content {
    color: @textColor;

    .mu-select-input {
      color: @textColor;
    }
  }
}

.mu-popover {
  background-color: @dialogBackgroundColor;

  .mu-list {
    padding: 0;
  }
}

.mu-option {
  color: @textColor;

  &.is-selected .mu-item {
    color: @primaryColor;
  }
}

.mu-flat-button.disabled {
  color: @disabledColor;
}

.mu-item {
  color: @textColor;

  .mu-item-action {
    color: @textColor;
  }

  &.is-selected {
    color: @primaryColor;

    .mu-item-action {
      color: @primaryColor;
    }
  }

}

.mu-loading-wrap {
  background-color: fade(@dialogBackgroundColor, 80%) !important;
  color: @textColor;
}

.mu-linear-progress {
  .mu-linear-progress-background, .mu-linear-progress-determinate {
    background-color: @secondaryColor !important;
  }
}

.mu-text-field-input {
  color: @textColor;

  &::placeholder {
    color: @trackColor;
    font-weight: 400;
  }
}

.mu-switch-checked {
  color: @primaryColor;
}

.mu-form-item__focus {
  color: @secondaryColor;
}

.mu-chip.mu-primary-color {
  background-color: @primaryColor;
}

.mu-circle-spinner {
  border-color: @primaryColor;
}

.notification-content {
  a {
    color: @textColor;
  }
}
`

import baseColor from './basecolor'

export default function (colorSet: Object) {
  return Object.keys(baseColor).reduce((acc, cur) => {
    return acc.replace(new RegExp(cur, 'g'), colorSet[cur])
  }, themeColorLessText + appColorLessText)
}
