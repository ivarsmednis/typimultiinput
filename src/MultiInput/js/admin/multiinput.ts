import Sortable from 'sortablejs';

// Declare global types
declare global {
    interface Window {
        alertify: any;
    }
}

interface Validator {
    function: (value: string, param?: any) => boolean;
    message: string;
}

interface Validators {
    [key: string]: Validator;
}

class MultiInput {
    private validators: Validators = {
        'required': { 
            function: this.validateRequired, 
            message: ':title is required' 
        },
        'max': { 
            function: this.validateMax, 
            message: ':title may not be greater than :value' 
        },
        'min': { 
            function: this.validateMin, 
            message: ':title must be at least :value' 
        }
    };

    constructor() {
        this.init();
    }

    private init(): void {
        this.bindEvents();
        this.initializeSortables();
        this.initializeFormValidation();
    }

    private bindEvents(): void {
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            
            // Find the actual button/element that has the class (could be parent of clicked element)
            const langButton = target.closest('.btn-lang-js') as HTMLElement;
            const addButton = target.closest('.multiinput-elem-add') as HTMLElement;
            const cloneButton = target.closest('.multiinput-elem-clone') as HTMLElement;
            const removeButton = target.closest('.multiinput-elem-remove') as HTMLElement;
            
            if (langButton) {
                this.handleLanguageSwitch(langButton);
            } else if (addButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleAddElement(addButton);
            } else if (cloneButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleCloneElement(cloneButton);
            } else if (removeButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleRemoveElement(removeButton);
            }
        });
    }

    private handleLanguageSwitch(button: HTMLElement): void {
        const locale = button.dataset.locale;
        const multiInputs = document.querySelectorAll('.multiinput .form-group');
        
        if (locale === 'all') {
            multiInputs.forEach(group => {
                (group as HTMLElement).style.display = '';
            });
        } else {
            multiInputs.forEach(group => {
                const translatableInputs = group.querySelectorAll('[data-translatable="1"]');
                if (translatableInputs.length > 0) {
                    const hasLocaleInput = group.querySelector(`[data-language="${locale}"]`);
                    (group as HTMLElement).style.display = hasLocaleInput ? '' : 'none';
                }
            });
        }
    }

    private handleAddElement(button: HTMLElement): void {
        const multiInput = button.closest('.multiinput');
        if (!multiInput) return;

        const tbody = multiInput.querySelector('table tbody') as HTMLTableSectionElement;
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        if (rows.length > 0) {
            const newRow = rows[0].cloneNode(true) as HTMLTableRowElement;
            tbody.appendChild(newRow);
            this.clearRowValues(newRow);
            this.orderRowNumbers(tbody);
        }
    }

    private handleCloneElement(button: HTMLElement): void {
        const multiInput = button.closest('.multiinput');
        const row = button.closest('tr');
        if (!multiInput || !row) return;

        const tbody = multiInput.querySelector('table tbody') as HTMLTableSectionElement;
        if (!tbody) return;

        const newRow = row.cloneNode(true) as HTMLTableRowElement;
        tbody.appendChild(newRow);
        this.hideRowFiles(newRow);
        this.orderRowNumbers(tbody);
    }

    private handleRemoveElement(button: HTMLElement): void {
        if (!confirm("Do you really want to delete this item?")) return;

        const tbody = button.closest('tbody') as HTMLTableSectionElement;
        const row = button.closest('tr');
        if (!tbody || !row) return;

        const rows = tbody.querySelectorAll('tr');
        if (rows.length > 1) {
            row.remove();
            this.orderRowNumbers(tbody);
        }
    }

    private orderRowNumbers(tbody: HTMLTableSectionElement): void {
        const rows = tbody.querySelectorAll('tr');
        const multiInput = tbody.closest('.multiinput') as HTMLElement;
        if (!multiInput) return;

        const attribute = multiInput.dataset.attribute;
        if (!attribute) return;

        const escapedAttribute = attribute.replace(/\[/g, '\\[').replace(/\]/g, '\\]');

        rows.forEach((row, index) => {
            const pattern = new RegExp(`^${escapedAttribute}\\[\\d+\\]`);
            const replacement = `${attribute}[${index}]`;

            // Update input, select, textarea elements
            const formElements = row.querySelectorAll('input, select, textarea');
            formElements.forEach(element => {
                const input = element as HTMLInputElement;
                if (input.name) {
                    const newName = input.name.replace(pattern, replacement);
                    input.name = newName;
                    input.id = newName;
                    
                    const label = row.querySelector(`label[for="${input.name}"]`) as HTMLLabelElement;
                    if (label) {
                        label.setAttribute('for', newName);
                    }
                }
            });

            // Update data attributes
            const cells = row.querySelectorAll('td');
            cells.forEach(td => {
                const cell = td as HTMLTableCellElement;
                if (cell.dataset.attribute) {
                    cell.dataset.attribute = cell.dataset.attribute.replace(pattern, replacement);
                }

                const nestedMultiInputs = cell.querySelectorAll('.multiinput');
                nestedMultiInputs.forEach(mi => {
                    const multiInputElement = mi as HTMLElement;
                    if (multiInputElement.dataset.attribute) {
                        multiInputElement.dataset.attribute = multiInputElement.dataset.attribute.replace(pattern, replacement);
                    }
                });
            });
        });
    }

    private clearRowValues(row: HTMLTableRowElement): void {
        // Clear input values
        const inputs = row.querySelectorAll('input:not([type="checkbox"])');
        inputs.forEach(input => {
            (input as HTMLInputElement).value = '';
        });

        // Clear select values
        const selects = row.querySelectorAll('select');
        selects.forEach(select => {
            (select as HTMLSelectElement).value = '';
        });

        // Clear textarea values
        const textareas = row.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            (textarea as HTMLTextAreaElement).value = '';
        });

        // Uncheck checkboxes
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            (checkbox as HTMLInputElement).checked = false;
        });

        // Remove nested multiinput rows except first
        const nestedRows = row.querySelectorAll('.multiinput tbody tr:not(:first-child)');
        nestedRows.forEach(nestedRow => nestedRow.remove());

        // Mark file manager items as new
        const fileItems = row.querySelectorAll('.filemanager-item-trans');
        fileItems.forEach(item => {
            item.classList.add('new-item');
            const cell = item.closest('td') as HTMLTableCellElement;
            if (cell) {
                cell.removeAttribute('data-rules');
            }
        });
    }

    private hideRowFiles(row: HTMLTableRowElement): void {
        const fileItems = row.querySelectorAll('.filemanager-item-trans');
        fileItems.forEach(item => {
            item.classList.add('new-item');
        });
    }

    private validateRequired(value: string): boolean {
        return value && value !== "undefined" && value !== "";
    }

    private validateMax(value: string, max: number): boolean {
        return !value || value === "undefined" || value.toString().length <= max;
    }

    private validateMin(value: string, min: number): boolean {
        return value && value !== "undefined" && value.toString().length >= min;
    }

    private renderValidationMessage(template: string, params: Record<string, any>): string {
        let result = template;
        for (const param in params) {
            result = result.replace(`:${param}`, params[param]);
        }
        return result;
    }

    private errorHandle(element: HTMLElement, add: boolean, message?: string): void {
        const formGroup = element.closest('.form-group');
        if (!formGroup) return;

        if (add && message) {
            element.classList.add('is-invalid');
            let feedback = formGroup.querySelector('.multiinput-invalid-feedback') as HTMLElement;
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.className = 'multiinput-invalid-feedback';
                formGroup.appendChild(feedback);
            }
            feedback.textContent = message;
        } else {
            element.classList.remove('is-invalid');
            const feedback = formGroup.querySelector('.multiinput-invalid-feedback');
            feedback?.remove();
        }
    }

    private validateForm(form: HTMLFormElement): { success: boolean; failedFields: string[] } {
        let success = true;
        const failedFields: string[] = [];
        const elements = form.querySelectorAll('.multiinput input, .multiinput textarea, .multiinput select');
        
        console.log('Validating form with', elements.length, 'multiinput elements');
        
        elements.forEach(element => {
            const input = element as HTMLInputElement;
            this.errorHandle(input, false);
            
            const cell = input.closest('td') as HTMLTableCellElement;
            if (!cell) {
                console.log('Element not in table cell, skipping:', input);
                return;
            }

            const rules = cell.dataset.rules;
            if (rules) {
                console.log('Validating field:', input.name || input.id, 'with rules:', rules, 'value:', input.value);
                
                try {
                    const rulesObj = JSON.parse(rules);
                    const messages: string[] = [];
                    const label = input.previousElementSibling as HTMLLabelElement;
                    const fieldName = label?.textContent?.trim() || input.placeholder || input.name || input.id || 'Field';
                    const messageParams: Record<string, any> = { title: fieldName };

                    for (const rule in rulesObj) {
                        const validator = this.validators[rule];
                        if (validator && typeof validator.function === 'function') {
                            const result = validator.function.call(this, input.value, rulesObj[rule]);
                            console.log('Rule:', rule, 'Result:', result, 'Value:', input.value, 'Param:', rulesObj[rule]);
                            
                            if (!result) {
                                if (typeof rulesObj[rule] !== 'object') {
                                    messageParams.value = rulesObj[rule];
                                }
                                messages.push(this.renderValidationMessage(validator.message, messageParams));
                            }
                        }
                    }

                    if (messages.length > 0) {
                        success = false;
                        failedFields.push(fieldName);
                        console.log('Validation failed for field:', fieldName, 'Messages:', messages);
                        this.errorHandle(input, true, messages.join(', '));
                    }
                } catch (e) {
                    console.log('Invalid JSON in rules, skipping validation for:', input.name || input.id, 'Rules:', rules);
                }
            }
        });

        console.log('Form validation result:', success, 'Failed fields:', failedFields);
        return { success, failedFields };
    }

    private initializeFormValidation(): void {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.querySelector('.multiinput')) {
                form.addEventListener('submit', (e) => {
                    // Only validate if this is not a multiinput action
                    const target = e.target as HTMLElement;
                    const isMultiInputAction = target.closest('.multiinput-elem-add, .multiinput-elem-clone, .multiinput-elem-remove');
                    
                    if (!isMultiInputAction) {
                        const validation = this.validateForm(form as HTMLFormElement);
                        if (!validation.success) {
                            e.preventDefault();
                            this.showValidationNotification(validation.failedFields);
                            return false;
                        }
                    }
                });
            }
        });
    }

    private showValidationNotification(failedFields: string[]): void {
        let message = 'Please fill the following required fields: ' + failedFields.join(', ');
        
        // Check if alertify is available (it's loaded in admin.js)
        if (typeof window.alertify !== 'undefined') {
            window.alertify.error(message);
        } else {
            // Fallback to simple alert
            alert(message);
        }
    }

    private initializeSortables(): void {
        const sortableTbodies = document.querySelectorAll('.sortable tbody');
        sortableTbodies.forEach(tbody => {
            new Sortable(tbody as HTMLElement, {
                handle: '.sortable-handle',
                animation: 150,
                onSort: () => {
                    this.orderRowNumbers(tbody as HTMLTableSectionElement);
                }
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MultiInput();
});

export default MultiInput;