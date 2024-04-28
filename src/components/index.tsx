import noop from '@jswork/noop';
import cx from 'classnames';
import React, { Component, HTMLAttributes } from 'react';
import VisibleElement from './visible-element';

const CLASS_NAME = 'react-dialog';
const uuid = () => Math.random().toString(36).substring(2, 9);

export type ReactDialogProps = {
  /**
   * The extended className for component.
   * @default ''
   */
  className?: string;
  /**
   * The backdrop className.
   * @default ''
   */
  backdropClassName?: string;
  /**
   * The dialog unique name.
   */
  uuid?: string;
  /**
   * The dialog visible status.
   */
  visible: boolean;
  /**
   * The dialog close callback.
   */
  onClose: () => void;
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
  /**
   * The backdrop props.
   */
  backdropProps?: HTMLAttributes<HTMLDivElement>;
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
  private veDialog: VisibleElement;
  private veBackdrop: VisibleElement;

  // ---- dom elements ----
  get dialog() {
    return this.dialogRef.current as HTMLDialogElement;
  }

  get backdrop() {
    return this.backdropRef.current as HTMLDivElement;
  }

  // ---- state react ----
  state = {
    animateVisible: this.props.visible
  };

  // ---- life cycle start ----
  componentDidMount() {
    const { visible } = this.props;
    if (visible) this.present();
    this.veDialog = new VisibleElement(this.dialog, { onChange: this.handleVeChange });
    this.veBackdrop = new VisibleElement(this.backdrop);
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
    if (this.veDialog.isVisible) return;
    this.veDialog.show();
    this.veBackdrop.show();
  };

  dismiss = () => {
    const { onClose } = this.props;
    if (!this.veDialog.isVisible) return;
    this.veDialog.close();
    this.veBackdrop.close();
    onClose?.();
  };

  handleVeChange = (state) => {
    if (state === 'show') this.setState({ animateVisible: true });
    if (state === 'hided') this.setState({ animateVisible: false });
  };

  render() {
    const {
      className,
      backdropClassName,
      visible,
      withBackdrop,
      fixed,
      children,
      keepMounted,
      closeOnEscape,
      closeOnBackdropClick,
      backdropProps,
      onClose,
      ...dialogProps
    } = this.props;

    const { animateVisible } = this.state;
    const keepChildren = keepMounted || animateVisible;

    return (
      <>
        <dialog
          id={this.uuid}
          role="dialog"
          aria-modal="true"
          data-component={CLASS_NAME}
          data-fixed={fixed}
          className={cx(CLASS_NAME, className)}
          ref={this.dialogRef}
          {...dialogProps}>
          {keepChildren ? children : null}
        </dialog>

        {
          withBackdrop && (
            <div
              id={`${this.uuid}-backdrop`}
              role="backdrop"
              aria-hidden="true"
              hidden
              className={cx(`${CLASS_NAME}__backdrop`, backdropClassName)}
              ref={this.backdropRef}
              onClick={closeOnBackdropClick ? this.dismiss : noop}
              {...backdropProps}
            />
          )
        }
      </>
    );
  }
}

