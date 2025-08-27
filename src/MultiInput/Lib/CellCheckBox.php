<?php

namespace Ivarsmednis\TypiMultiInput\Lib;

use BootForm;

class CellCheckBox extends CellBase
{

    public function renderTranslatable($value = null, $language = false)
    {
        if ($language) {
            $element =  BootForm::checkbox($this->title.' ('.$language.')', $this->attributeName.'['.$language.']')
                ->data('translatable', 1)->data('language', $language);
        } else {
            $element =  BootForm::checkbox($this->title, $this->attributeName)->value($value);
        }
        if ($value) {
            $element->check();
        }
        return $element;
    }

    public function publish($key = false)
    {
        $value = parent::publish($key);
        if ($key) {
            return $value;
        }
        if ($value) {
            return __('db.' . $this->config['title']);
        }
    }


}