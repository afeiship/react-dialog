// import noop from '@jswork/noop';
import classNames from 'classnames';
import React, { Component, HTMLAttributes } from 'react';

const CLASS_NAME = 'react-dialog';

export type ReactDialogProps = {
  /**
   * The extended className for component.
   */
  className?: string;
  /**
   * The dialog visible status.
   */
  visible?: boolean;
  /**
   * Whether to show backdrop or not.
   */
  withBackdrop?: boolean;
  /**
   * Whether to fixed dialog or not.
   */
  fixed?: boolean;
} & HTMLAttributes<HTMLDialogElement>;

// var dialog = document.querySelector('dialog');
// document.querySelector('#show').onclick = function () {
//   dialog.show();
//   // dialog.showModal();
// };
// document.querySelector('#close').onclick = function () {
//   dialog.classList.add('hide');
//   dialog.addEventListener('webkitAnimationEnd', function () {
//     dialog.classList.remove('hide');
//     dialog.close();
//     dialog.removeEventListener('webkitAnimationEnd', arguments.callee, false);
//   }, false);
// };

export default class ReactDialog extends Component<ReactDialogProps> {
  static displayName = CLASS_NAME;
  static version = '__VERSION__';
  static defaultProps = {
    visible: false,
    fixed: false,
    withBackdrop: false,
  };

  private dialogRef = React.createRef<HTMLDialogElement>();

  get dialog() {
    return this.dialogRef.current as HTMLDialogElement;
  }

  shouldComponentUpdate(nextProps): boolean {
    const { visible } = nextProps;
    if (visible) this.present();
    if (!visible) this.dismiss();
    return true;
  }

  present = () => {
    const { withBackdrop } = this.props;
    const showMethod = withBackdrop ? 'showModal' : 'show';
    this.dialog[showMethod]();
  };

  dismiss = () => {
    const el = this.dialog;
    el.classList.add('is-hide');
    el.addEventListener('webkitAnimationEnd', this.handleAnimationEnd, false);
  };

  handleAnimationEnd = () => {
    const el = this.dialog;
    el.classList.remove('is-hide');
    el.close();
    el.removeEventListener('webkitAnimationEnd', this.handleAnimationEnd, false);
  };

  render() {
    const { className, visible, withBackdrop, fixed, ...props } = this.props;

    return (
      <dialog
        data-component={CLASS_NAME}
        data-backdrop={withBackdrop}
        data-fixed={fixed}
        className={classNames(CLASS_NAME, className)}
        ref={this.dialogRef}
        {...props} />
    );
  }
}
