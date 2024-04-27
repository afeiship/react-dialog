// import noop from '@jswork/noop';
import classNames from 'classnames';
import React, { Component, HTMLAttributes } from 'react';
import VisibleElement from './visible-element';

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
    stateVisible: this.props.visible
  };

  // ---- life cycle start ----
  componentDidMount() {
    const { visible } = this.props;
    if (visible) this.present();
    this.veDialog = new VisibleElement(this.dialog, { onStateChange: this.handleVeStateChange });
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
    if (!this.veDialog.isVisible) return;
    this.veDialog.hide();
    this.veBackdrop.hide();
  };

  handleVeStateChange = (state) => {
    if (state === 'show') this.setState({ stateVisible: true });
    if (state === 'hided') this.setState({ stateVisible: false });
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
      backdropProps,
      ...dialogProps
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
          {...dialogProps}>
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
              {...backdropProps}
            />
          )
        }
      </>
    );
  }
}

