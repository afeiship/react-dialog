// import noop from '@jswork/noop';
import classNames from 'classnames';
import React, { Component, HTMLAttributes } from 'react';

const CLASS_NAME = 'react-dialog';
const uuid = () => Math.random().toString(36).substring(2, 9);

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
  /**
   * Whether to keep dialog mounted or not.
   */
  keepMounted?: boolean;
} & HTMLAttributes<HTMLDialogElement> & React.RefAttributes<HTMLDialogElement>;

export default class ReactDialog extends Component<ReactDialogProps> {
  static displayName = CLASS_NAME;
  static version = '__VERSION__';
  static defaultProps = {
    visible: false,
    fixed: false,
    withBackdrop: false,
    keepMounted: false
  };

  private dialogRef = React.createRef<HTMLDialogElement>();
  private backdropRef = React.createRef<HTMLDivElement>();
  private id = `${CLASS_NAME}-${uuid()}`;

  // ---- dom elements ----
  get dialog() {
    return this.dialogRef.current as HTMLDialogElement;
  }

  get backdrop() {
    return this.backdropRef.current as HTMLDivElement;
  }

  // ---- computed props ----
  get isVisible() {
    return this.dialog.open;
  }

  // ---- state react ----
  state = {
    stateVisible: this.props.visible
  };

  // ---- life cycle start ----
  componentDidMount() {
    const { visible } = this.props;
    if (visible) this.present();
  }

  shouldComponentUpdate(nextProps: ReactDialogProps): boolean {
    const { visible } = nextProps;
    if (visible) this.present();
    if (!visible) this.dismiss();
    return true;
  }

  // ---- life cycle end ----

  // ---- public methods ----
  present = () => {
    if (this.isVisible) return;
    // const { withBackdrop } = this.props;
    this.dialog.show();
    this.setState({ stateVisible: this.isVisible });
    this.backdrop.removeAttribute('hidden');
    this.backdrop.setAttribute('data-visible', 'true');
  };

  dismiss = () => {
    if (!this.isVisible) return;
    const el = this.dialog;
    el.classList.add('is-hide');
    el.addEventListener('webkitAnimationEnd', this.handleAnimationEnd, false);
    this.backdrop.setAttribute('data-visible', 'false');
    this.backdrop.addEventListener('webkitAnimationEnd', this.handleBackdropAnimationEnd, false);
  };

  private handleAnimationEnd = () => {
    const el = this.dialog;
    el.classList.remove('is-hide');
    el.close();
    el.removeEventListener('webkitAnimationEnd', this.handleAnimationEnd, false);
    this.setState({ stateVisible: this.isVisible });
  };

  private handleBackdropAnimationEnd = () => {
    this.backdrop.hidden = true;
    this.backdrop.removeEventListener('webkitAnimationEnd', this.handleBackdropAnimationEnd, false);
  };

  render() {
    const { className, visible, withBackdrop, fixed, children, keepMounted, ...props } = this.props;
    const { stateVisible } = this.state;
    const keepChildren = keepMounted || stateVisible;

    return (
      <>
        <dialog
          id={this.id}
          data-component={CLASS_NAME}
          data-fixed={fixed}
          className={classNames(CLASS_NAME, className)}
          ref={this.dialogRef}
          {...props}>
          {keepChildren ? children : null}
        </dialog>
        <div
          id={`${this.id}-backdrop`}
          hidden
          className={`${CLASS_NAME}__backdrop`}
          ref={this.backdropRef}
        />
      </>
    );
  }
}
