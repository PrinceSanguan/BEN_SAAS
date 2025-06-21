<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PageContent extends Model
{
    protected $fillable = ['section', 'field', 'value', 'type'];

    public static function get($section, $field, $default = '')
    {
        $content = static::where('section', $section)->where('field', $field)->first();
        return $content ? $content->value : $default;
    }

    public static function set($section, $field, $value, $type = 'text')
    {
        return static::updateOrCreate(
            ['section' => $section, 'field' => $field],
            ['value' => $value, 'type' => $type]
        );
    }

    public function deleteOldImage()
    {
        if ($this->type === 'image' && $this->value) {
            Storage::disk('upload-image')->delete($this->value);
        }
    }
}
