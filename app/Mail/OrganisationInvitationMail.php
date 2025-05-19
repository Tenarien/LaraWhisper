<?php

namespace App\Mail;

use App\Models\OrganisationInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrganisationInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public OrganisationInvitation $invite)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Organisation Invitation Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        $url = route('organisation.invitation.accept', $this->invite->token);

        return $this->subject("You’ve been invited to join “{$this->invite->organisation->name}”")
            ->markdown('emails.organisation.invitation')
            ->with([
                'inviter' => auth()->user(),
                'organisation' => $this->invite->organisation,
                'url' => $url,
            ]);
    }
}
