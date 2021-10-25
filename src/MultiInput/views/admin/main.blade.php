<div class="@if (!empty($className)){{ $className }}@endif" data-attribute="{{ $attribute }}">
    <div class="multiinput-header" style="margin-bottom: 4px;">
        {{-- <div class="multiinput-title @if ($root) h5 @endif">{{ $title }}</div> --}}
        <div ></div>
        @if (!$root)
        <div class="multiinput-title @if ($root) h5 hidden @endif">{{ $title }}</div>
        @endif
        @if (empty($config['single-row']))
            <span class="multiinput-elem-add" title="{{ __('multiinput::admin.add-item') }}">
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class=""><path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"></path></svg>
            </span>
        @endif
    </div>
    <table class="multiinput-body table table-striped @if (!empty($config['sort-enable'])) sortable @endif">
        <tbody>
            {!! $body !!}
        </tbody>
    </table>
</div>
