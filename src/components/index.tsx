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
   * The dialog unique name.
   */
  uuid?: string;
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
  /**
   * Whether to close dialog on escape keydown.
   */
  closeOnEscape?: boolean;
  /**
   * Whether close dialog on click backdrop.
   */
  closeOnBackdropClick?: boolean;
} & HTMLAttributes<HTMLDialogElement> & React.RefAttributes<HTMLDialogElement>;

export default class ReactDialog extends Component<ReactDialogProps> {
  static displayName = CLASS_NAME;
  static version = '__VERSION__';
  static defaultProps = {
    visible: false,
    fixed: false,
    withBackdrop: false,
    keepMounted: false,
    closeOnEscape: false,
    closeOnBackdropClick: false
  };

  private dialogRef = React.createRef<HTMLDialogElement>();
  private backdropRef = React.createRef<HTMLDivElement>();
  private uuid = this.props.uuid || `${CLASS_NAME}-${uuid()}`;

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
    this.dialog.show();
    this.setState({ stateVisible: this.isVisible });
    this.backdrop.removeAttribute('hidden');
    this.backdrop.setAttribute('data-visible', 'true');
  };

  dismiss = () => {
    if (!this.isVisible) return;
    this.dialog.classList.add('is-hide');
    this.dialog.addEventListener('webkitAnimationEnd', this.handleAnimationEnd, { once: true });
    this.backdrop.setAttribute('data-visible', 'false');
    this.backdrop.addEventListener('webkitAnimationEnd', this.handleBackdropAnimationEnd, { once: true });
  };

  private handleAnimationEnd = () => {
    this.dialog.classList.remove('is-hide');
    this.dialog.close();
    this.setState({ stateVisible: this.isVisible });
  };

  private handleBackdropAnimationEnd = () => {
    this.backdrop.hidden = true;
  };

  render() {
    const {
      className,
      visible,
      withBackdrop,
      fixed,
      children,
      keepMounted,
      closeOnEscape,
      closeOnBackdropClick,
      ...props
    } = this.props;

    const { stateVisible } = this.state;
    const keepChildren = keepMounted || stateVisible;

    return (
      <>
        <dialog
          id={this.uuid}
          role="dialog"
          aria-modal="true"
          data-component={CLASS_NAME}
          data-fixed={fixed}
          className={classNames(CLASS_NAME, className)}
          ref={this.dialogRef}
          {...props}>
          {keepChildren ? children : null}
        </dialog>

        {
          withBackdrop && (
            <div
              id={`${this.uuid}-backdrop`}
              role="presentation"
              aria-hidden="true"
              hidden
              className={`${CLASS_NAME}__backdrop`}
              ref={this.backdropRef}
            />
          )
        }
      </>
    );
  }
}

