import {IInputs, IOutputs} from "./generated/ManifestTypes";

var Editor = require('tui-editor/dist/tui-editor-Editor-all');

export class texteditor implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _value: any;
	private _btnUpdate : HTMLButtonElement;

	private _notifyOutputChanged: () => void;
	private _context: ComponentFramework.Context<IInputs>;

    private _container : HTMLDivElement;
	private _txtEditor : HTMLDivElement;
	private _editor : any;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		
		this._container = document.createElement("div");
		this._txtEditor = document.createElement("div");
		this._txtEditor.id="editSection" ;

		this._btnUpdate = document.createElement("button");
		this._btnUpdate.id = "btnUpdate";
		this._btnUpdate.className = "btnUpdate";
		this._btnUpdate.innerHTML = "Update Text";
		this._btnUpdate.addEventListener("click", this.updateData.bind(this));

       // Added css link for validation purpose remove files before build

        var _linkcontentCss = document.createElement("link");
		_linkcontentCss.href =  "https://cdnjs.cloudflare.com/ajax/libs/tui-editor/1.4.1/tui-editor.css";
		_linkcontentCss.type="text/css";
		_linkcontentCss.rel="stylesheet";

		var _linkEditorCss = document.createElement("link");
		_linkEditorCss.href = "https://cdnjs.cloudflare.com/ajax/libs/tui-editor/1.4.1/tui-editor-contents.css";
		_linkEditorCss.type="text/css";
		_linkEditorCss.rel="stylesheet";

        // Create editor  
		this._editor =  new Editor({
			el: this._txtEditor,
			viewer: true,
			initialEditType: 'markdown',
			previewStyle: 'vertical',
			useCommandShortcut: true,
			initialValue : context.parameters.txtEditorProperty.formatted ? context.parameters.txtEditorProperty.formatted : "",
			exts: ['scrollSync', 'colorSyntax', 'uml', 'chart', 'mark', 'table']
		});
        
		this._container.append(this._txtEditor)
		this._container.append(this._btnUpdate)
		container.before(_linkEditorCss);
		container.before(_linkcontentCss);
		container.append(this._container);
	}

	updateData(evt: Event): void {
		 this._value = this._editor.getValue();
		this._notifyOutputChanged();
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this._context = context;
		// Add code to update control view
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			txtEditorProperty : this._value
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}
