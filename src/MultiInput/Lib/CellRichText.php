<?php

namespace Ivarsmednis\TypiMultiInput\Lib;

use BootForm;
use Ivarsmednis\TypiMultiInput\Multiinput;

class CellRichText extends CellBase
{

    public function renderTranslatable($value = null, $language = false)
    {
        $templates = Multiinput::getTemplates();
        $attribute = $language ? $this->attributeName.'['.$language.']' : $this->attributeName;

        if (isset($templates['richtext'])) {
            try {
                return view($templates['richtext'], [
                    'attribute' => $attribute,
                    'value' => $value ? $value : '',
                    'language' => $language,
                    'label' => $this->title,
                ])->render();
            } catch (\Exception $e) {
                \Log::error('MultiInput richtext template error: '.$e->getMessage());
            }
        }

        if ($language) {
            return BootForm::textarea($this->title.' ('.$language.')', $attribute)
                ->data('translatable', 1)->data('language', $language)->rows(4)
                ->value($value ? $value : "")
                ->class('ckeditor-light');
        }
        return BootForm::textarea($this->title, $attribute)->rows(4)->value($value ? $value : "");
    }


}
