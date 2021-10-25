<?php

namespace Ivarsmednis\TypiMultiInput\Lib;

use TypiCMS\Modules\Files\Models\File;
use Ivarsmednis\TypiMultiInput\Multiinput;

class CellFile extends CellBase
{

    protected function renderTranslatable($value = null, $language = false)
    {
        $templates = Multiinput::getTemplates();
        $file = null;
        if ($value) {
            $file = File::find($value);
        }
        $title = $language ? $this->title.' ('.$language.')' : $this->title;
        $attribute = $language ? $this->attributeName.'['.$language.']' : $this->attributeName;
        return view(
            $templates['file'],
            [
                'type' => 'document',
                'label' => $title,
                'attribute' => $attribute,
                'value' => $file,
                'language' => $language ? $language : null,
                'translatable' => $language ? 1 : null,
            ]
        );
    }

    public function publish($key = false)
    {
        $id = parent::publish($key);
        if ($key) {
            return $id;
        }
        $file = File::find($id);
        if ($file) {
            $templates = Multiinput::getTemplates();
            return view($templates['file'], ['file' => $file]);
        }
    }
}