<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Invitation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0; padding:0; background-color:#f2f4f6; font-family:Arial, sans-serif; color:#51545E;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center" style="padding:25px;">
            <table width="570" cellpadding="0" cellspacing="0" role="presentation"
                   style="background-color:#ffffff; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                    <td style="padding:35px;">

                        {{-- Header --}}
                        <h1 style="margin-top:0; font-size:22px; font-weight:bold; color:#333333;">
                            You’ve been invited to join<br>
                            <span style="color:#3869D4;">{{ $organisation->name ?? config('app.name') }}</span>
                        </h1>

                        {{-- Intro --}}
                        <p style="font-size:16px; line-height:1.5em;">
                            Hello there,
                        </p>
                        <p style="font-size:16px; line-height:1.5em;">
                            You’ve received an invitation to join <strong>{{ config('app.name') }}</strong>.
                            Click the button below to accept:
                        </p>

                        {{-- Button --}}
                        <table align="center" role="presentation" cellpadding="0" cellspacing="0"
                               style="margin:30px auto;">
                            <tr>
                                <td bgcolor="#3869D4" style="border-radius:4px;">
                                    <a href="{{ $url }}" target="_blank"
                                       style="display:inline-block; padding:10px 18px; font-size:16px;
                              color:#ffffff; text-decoration:none; border-radius:4px;">
                                        Accept Invitation
                                    </a>
                                </td>
                            </tr>
                        </table>

                        {{-- Fallback URL --}}
                        <p style="font-size:16px; line-height:1.5em;">
                            If you’re having trouble clicking the button, copy and paste the URL below into your browser:
                        </p>
                        <p style="font-size:14px; line-height:1.5em; word-break:break-all;">
                            <a href="{{ $url }}" target="_blank"
                               style="color:#3869D4; text-decoration:none;">
                                {{ $url }}
                            </a>
                        </p>

                        {{-- Footer --}}
                        <p style="font-size:16px; line-height:1.5em; margin-top:30px;">
                            Thanks,<br>
                            {{ config('app.name') }}
                        </p>

                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
