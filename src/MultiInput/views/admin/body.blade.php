@foreach ($rows as $row)
    <tr class="multiinput-row">
        @if (!empty($config['sort-enable']))
            <td class="sortable-handle">
                <svg width="16px" height="16px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9 6.417a1 1 0 0 1-.9.571H6V17a1 1 0 0 1-2 0V6.988H1a1 1 0 0 1-.9-.571.983.983 0 0 1 .12-1.051l4-5.006a1.024 1.024 0 0 1 1.56 0l4 5.006a.983.983 0 0 1 .12 1.051zm8 5.166a1 1 0 0 0-.9-.571h-3V1a1 1 0 0 0-2 0v10.012H9a1 1 0 0 0-.9.571.983.983 0 0 0 .12 1.051l4 5.006a1.024 1.024 0 0 0 1.56 0l4-5.006a.983.983 0 0 0 .12-1.051z" fill="#000000" fill-rule="evenodd"/>
                </svg>
            </td>
        @endif
        {!! $row !!}
        @if (empty($config['single-row']) || !empty($config['clone-enable']) )
            <td class="multiinput-elem-actions text-end">

                
               <span style="margin: 2px;">
                    <svg class="multiinput-elem-remove" width="16px" height="16px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 493.456 493.456" style="enable-background:new 0 0 493.456 493.456;" xml:space="preserve" >
               <g>
                   <g>
                       <path d="M246.73,0C110.678,0,0.002,110.68,0.002,246.712c0,136.06,110.676,246.744,246.728,246.744
                           c136.048,0,246.724-110.684,246.724-246.744C493.454,110.68,382.778,0,246.73,0z M362.398,254.576c0,4.156-1.536,7.564-5.7,7.564
                           H138.862c-4.152,0-7.804-3.408-7.804-7.564v-15.712c0-4.156,3.652-7.572,7.804-7.572h216.252c4.16,0,7.284,3.416,7.284,7.572
                           V254.576z"/>
                   </g>
               </g>
               </svg>
            </span>
                
           

                @if (!empty($config['clone-enable']))
                    <i title="{{ __('multiinput::admin.clone-item') }}" class="fa fa-lg fa-copy multiinput-elem-clone"></i>
                @endif
            </td>
        @endif
    </tr>
@endforeach
