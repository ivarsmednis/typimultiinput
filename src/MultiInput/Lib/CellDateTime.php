<?php

namespace Ivarsmednis\TypiMultiInput\Lib;

use BootForm;

class CellDateTime extends CellBase
{

    protected function renderTranslatable($value = null, $language = false)
    {
        if ($language) {
            return BootForm::datetimelocal($this->title.' ('.$language.')', $this->attributeName.'['.$language.']')
                ->data('translatable', 1)->data('language', $language)->value($value);
        }
        return BootForm::datetimelocal($this->title, $this->attributeName)->value($value);
    }

}