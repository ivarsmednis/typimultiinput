<tiptap-editor
    name="{{ $attribute }}"
    locale="{{ $language ?? app()->getLocale() }}"
    :init-content="{{ json_encode($value ?? '') }}"
    :label="'{{ addslashes($label) }}'"
></tiptap-editor>

