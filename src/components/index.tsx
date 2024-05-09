import noop from '@jswork/noop';
import cx from 'classnames';
import React, { Component, HTMLAttributes } from 'react';
import VisibleElement from '@jswork/visible-element';

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
   * The dialog zIndex.
   * @default 100
   */
  zIndex?: number;
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
    zIndex: 100,
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

  get dialogStyle() {
    const { zIndex, style } = this.props;
    return { zIndex, ...style } as React.StyleHTMLAttributes<HTMLDialogElement>;
  }

  get backdrop() {
    return this.backdropRef.current as HTMLDivElement;
  }

  get backdropStyle() {
    const { zIndex, style } = this.props;
    return { zIndex: zIndex! - 1, ...style } as React.StyleHTMLAttributes<HTMLDivElement>;
  }

  // ---- state react ----
  state = {
    animateVisible: this.props.visible
  };

  // ---- life cycle start ----
  constructor(props: ReactDialogProps) {
    super(props);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidMount() {
    const { visible } = this.props;
    if (visible) this.present();
    this.veDialog = new VisibleElement(this.dialog);
    this.veBackdrop = new VisibleElement(this.backdrop);
  }

  shouldComponentUpdate(nextProps: ReactDialogProps): boolean {
    const { visible } = nextProps;
    if (visible) this.present();
    if (!visible) this.dismiss();
    return true;
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  // ---- life cycle end ----

  // ---- public methods ----
  present = () => {
    this.veDialog.show();
    this.veBackdrop.show();
  };

  dismiss = () => {
    const { onClose } = this.props;
    this.veDialog.close();
    this.veBackdrop.close();
    onClose?.();
  };

  handleKeyDown = (event: KeyboardEvent) => {
    const { closeOnEscape } = this.props;
    const { key } = event;
    if (!closeOnEscape) return;
    if ('Escape' === key) this.dismiss();
  };

  render() {
    const {
      className,
      backdropClassName,
      visible,
      withBackdrop,
      zIndex,
      fixed,
      children,
      keepMounted,
      closeOnEscape,
      closeOnBackdropClick,
      backdropProps,
      onClose,
      ...dialogProps
    } = this.props;

    const keepChildren = keepMounted || this.veDialog?.visible;

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
          style={this.dialogStyle}
          {...dialogProps}
        >
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
              style={this.backdropStyle}
              {...backdropProps}
            />
          )
        }
      </>
    );
  }
}
